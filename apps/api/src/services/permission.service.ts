import User from "../modules/user/user.model";
import Role from "../modules/role/role.model";
import redisWrapper from "../middlewares/redis.mdw"
import { IRoleDoc, IUserDoc, IResult } from "../utils/interfaces.util";

const RBAC_USER_CACHE_KEY = (userId: string) => `rbac:perms:user:${userId}`;
const DEFAULT_TTL = Number(process.env.RBAC_CACHE_TTL || process.env.CACHE_TTL || 300);

function normalize(entity: string, action: string) {
  return `${String(entity).toLowerCase()}:${String(action).toLowerCase()}`;
}

async function expandRolePermissions(role: IRoleDoc): Promise<string[]> {
  // role.permissions is an array of canonical strings already
  return role.permissions ? role.permissions.map((p) => String(p).toLowerCase()) : [];
}

export async function resolveUserPermissions(userOrId: string | IUserDoc): Promise<Set<string>> {
  let user: IUserDoc | null = null;

  if (typeof userOrId === "string") {
    // check cache first
    const cacheKey = RBAC_USER_CACHE_KEY(userOrId);
    const cached = await redisWrapper.fetchData<string[]>(cacheKey);
    if (cached) return new Set(cached);

    user = await User.findById(userOrId).populate("roles").lean();
  } else {
    user = userOrId as IUserDoc;
    if (!user._id) throw new Error("Invalid user document");
  }

  if (!user) return new Set();

  // super users get wildcard
  if ((user as any).isSuper) {
    const wildcard = new Set(["*:*"]);
    // cache wildcard for the user
    await redisWrapper.keepData({ key: RBAC_USER_CACHE_KEY(String(user._id)), value: Array.from(wildcard) }, DEFAULT_TTL);
    return wildcard;
  }

  const perms = new Set<string>();

  // user-level permissions (explicit grants)
  if (user.permissions && Array.isArray(user.permissions)) {
    for (const p of user.permissions) perms.add(String(p).toLowerCase());
  }

  // role permissions
  const roles: Array<IRoleDoc> = (user as any).roles || [];
  for (const r of roles) {
    const expanded = await expandRolePermissions(r as IRoleDoc);
    for (const p of expanded) perms.add(p);
  }

  // cache
  await redisWrapper.keepData({ key: RBAC_USER_CACHE_KEY(String(user._id)), value: Array.from(perms) }, DEFAULT_TTL);

  return perms;
}

function matchPermission(requested: string, perms: Set<string>): boolean {
  requested = requested.toLowerCase();
  if (perms.has("*:*")) return true; // global wildcard
  if (perms.has(requested)) return true;

  // wildcard checks: entity:* or *:action
  const [entity, action] = requested.split(":");
  if (perms.has(`${entity}:*`)) return true;
  if (perms.has(`*:${action}`)) return true;

  return false;
}

export async function hasPermission(
  userOrId: string | IUserDoc,
  permOrEntity: string | { entity: string; action: string },
  options?: { resourceOwnerId?: string | null; checkOwnership?: boolean }
): Promise<boolean> {
  const checkOwnership = options?.checkOwnership ?? true;

  let user: IUserDoc | null = null;
  if (typeof userOrId === "string") {
    user = await User.findById(userOrId).populate("roles").exec();
  } else {
    user = userOrId as IUserDoc;
  }

  if (!user) return false;

  if ((user as any).isSuper) return true;

  const requested = typeof permOrEntity === "string" ? permOrEntity : normalize(permOrEntity.entity, permOrEntity.action);

  // ownership short-circuit: if user owns the resource and checkOwnership is enabled
  if (checkOwnership && options?.resourceOwnerId && String(user._id) === String(options.resourceOwnerId)) {
    // allow ownership for update/read/delete by default
    return true;
  }

  const perms = await resolveUserPermissions(user);
  return matchPermission(requested, perms);
}

export async function clearUserCache(userId: string): Promise<void> {
  await redisWrapper.deleteData(RBAC_USER_CACHE_KEY(userId));
}

/**
 * Initialize default permissions for a new user based on their role.
 * Attaches the role to the user and copies role.permissions into user.permissions.
 */
export async function initiatePermissionData(user: IUserDoc): Promise<IResult> {
  const result: IResult = { error: false, message: '', code: 200, data: {} };
  try {
    // find role by userType (role names are stored as strings matching userType)
    const role = await Role.findOne({ name: user.userType });
    if (!role) {
      result.error = true;
      result.code = 404;
      result.message = `Role not found for user type: ${user.userType}`;
      return result;
    }

    // Assign role id
    user.roles = role._id as any;

    // Use role.permissions as the user's default permissions
    if (Array.isArray(role.permissions)) {
      user.permissions = role.permissions.map((p: any) => String(p));
    } else {
      user.permissions = [] as any;
    }

    await user.save();
    result.data = user;
    result.message = 'Permissions initialized';
    return result;
  } catch (err: any) {
    result.error = true;
    result.code = 500;
    result.message = err?.message || 'Failed to initiate permission data';
    return result;
  }
}

export default {
  resolveUserPermissions,
  hasPermission,
  clearUserCache,
  initiatePermissionData,
  // Backwards compatible: updatePermissions was referenced in several places.
  async updatePermissions(user: IUserDoc, permissionPayload: any): Promise<IResult> {
    const result: IResult = { error: false, message: "", code: 200, data: {} };
    try {
      const role = await Role.findOne({ _id: permissionPayload.role || user.roles?.[0] });
      if (!role) {
        result.error = true;
        result.code = 400;
        result.message = "Invalid user role";
        return result;
      }

      const invalidPermissions = (permissionPayload.permissions || []).filter(
        (p: string) => !role.permissions.includes(p)
      );

      if (invalidPermissions.length > 0) {
        result.error = true;
        result.code = 400;
        result.message = `Invalid permissions for role ${role.name}: ${invalidPermissions.join(", ")}`;
        return result;
      }

      // Assign validated permissions to user and persist
      user.permissions = permissionPayload.permissions;
      await user.save();

      result.data = user;
      result.message = "Permissions updated successfully";
      return result;
    } catch (err: any) {
      result.error = true;
      result.code = 500;
      result.message = err?.message || "Failed to update permissions";
      return result;
    }
  },
};


// import { Types } from "mongoose";
// import { IResult, IUserDoc } from "../utils/interfaces.util";
// import Role from "../models/Role.model";
// import { UserType } from "../utils/enums.util";
// import { IPermissionDTO } from "../dtos/system.dto";

// class PermissionService {
//   /**
//    * @name initiatePermissionData
//    * @description initiates default permissions for a new user based on their role
//    * @param user User object containing role information
//    * @returns Updated user object with permissions
//    */
//   static async initiatePermissionData(user: IUserDoc): Promise<any> {
//     let actions: string[] = [];

//     if (user.userType === UserType.SUPERADMIN) {
//       actions = [
//         // System Management
//         "system:read",
//         "system:update",
//         "system:configure",
//         "system:restart",

//         // User Management
//         "user:create",
//         "user:read",
//         "user:update",
//         "user:delete",
//         "user:disable",

//         // Role & Permission Management
//         "role:create",
//         "role:read",
//         "role:update",
//         "role:delete",
//         "role:disable",
//         "permission:create",
//         "permission:read",
//         "permission:update",
//         "permission:delete",
//         "permission:disable",

//         // Content Management
//         "sermon:create",
//         "sermon:read",
//         "sermon:update",
//         "sermon:delete",
//         "sermon:destroy",
//         "sermonbite:create",
//         "sermonbite:read",
//         "sermonbite:update",
//         "sermonbite:delete",
//         "sermonbite:destroy",
//         "playlist:create",
//         "playlist:read",
//         "playlist:update",
//         "playlist:delete",
//         "playlist:destroy",
//         "playlist:disable",

//         // Subscription & Transaction Management
//         "subscription:create",
//         "subscription:read",
//         "subscription:update",
//         "subscription:cancel",
//         "transaction:create",
//         "transaction:read",
//         "transaction:update",
//         "transaction:refund",
//         "plan:create",
//         "plan:read",
//         "plan:update",
//         "plan:delete",

//         // API Management
//         "apikey:create",
//         "apikey:read",
//         "apikey:update",
//         "apikey:disable",
//         "apikey:delete",

//         // Analytics & Revenue
//         "analytics:read",
//         "analytics:update",
//         "analytics:export",
//         "revenue:read",
//         "revenue:update",

//         // Advertisement Management
//         "ads:create",
//         "ads:read",
//         "ads:update",
//         "ads:delete",
//       ];
//     } else if (user.userType === UserType.ADMIN) {
//       actions = [
//         // User Management
//         "user:create",
//         "user:read",
//         "user:update",
//         "user:delete",
//         "user:disable",

//         // Role & Permission Management
//         "role:create",
//         "role:read",
//         "role:update",
//         "role:delete",
//         "role:disable",
//         "permission:create",
//         "permission:read",
//         "permission:update",
//         "permission:delete",
//         "permission:disable",

//         // Content Management
//         "sermon:create",
//         "sermon:read",
//         "sermon:update",
//         "sermon:delete",
//         "sermon:destroy",
//         "sermonbite:create",
//         "sermonbite:read",
//         "sermonbite:update",
//         "sermonbite:delete",
//         "sermonbite:destroy",
//         "playlist:create",
//         "playlist:read",
//         "playlist:update",
//         "playlist:delete",
//         "playlist:destroy",
//         "playlist:disable",

//         // Subscription & Transaction Management
//         "subscription:create",
//         "subscription:read",
//         "subscription:update",
//         "subscription:cancel",
//         "transaction:create",
//         "transaction:read",
//         "transaction:update",
//         "transaction:refund",
//         "plan:create",
//         "plan:read",
//         "plan:update",
//         "plan:delete",

//         // API Management
//         "apikey:create",
//         "apikey:read",
//         "apikey:update",
//         "apikey:disable",
//         "apikey:delete",

//         // Analytics & Revenue
//         "analytics:read",
//         "analytics:update",
//         "analytics:export",
//         "revenue:read",
//         "revenue:update",

//         // Advertisement Management
//         "ads:create",
//         "ads:read",
//         "ads:update",
//         "ads:delete",
//       ];
//     }  else if (user.userType === UserType.ORGANISATION) {
//       actions = [
//         // Content Management
//         "sermonbite:create",
//         "sermonbite:read",
//         "sermonbite:update",
//         "sermonbite:delete",

//         // Playlist Management
//         "playlist:create",
//         "playlist:read",
//         "playlist:update",
//         "playlist:delete",
//         "playlist:destroy",

//         // Analytics & Profile
//         "analytics:read",
//         "analytics:export",
//         "user:read",
//         "user:update",

//         // Basic Access
//         "sermon:read",
//         "sermonbite:read",
//       ];
//     } else if (user.userType === UserType.TALENT) {
//       actions = [
//         "user:read",
//         "user:update",
//         "sermon:read",
//         "sermonbite:read",
//         "playlist:create",
//         "playlist:read",
//         "playlist:update",
//         "playlist:delete",
//       ];
//     } else {
//       actions = ["user:read", "sermon:read", "sermonbite:read"];
//     }

//     const role = await Role.findOne({ name: user.userType });
//     if (!role) {
//       throw new Error(`Role not found for user type: ${user.userType}`);
//     }

//     // Validate permissions against role's allowed permissions
//     const validPermissions = actions.filter((p) =>
//       role.permissions.includes(p)
//     );

//     user.roles = role._id;
//     user.roles.permissions = validPermissions;

//     return user;
//   }


  
//   static rolePermissionMap: Record<string, string[]> ={
//     [UserType.SUPERADMIN]: [
//       // System Management
//       "system:read", "system:update", "system:configure", "system:restart",

//       // User Management
//       "user:create", "user:read", "user:update", "user:delete", "user:disable",

//       // Role & Permission Management
//       "role:create", "role:read", "role:update", "role:delete", "role:disable",
//       "permission:create", "permission:read", "permission:update", "permission:delete", "permission:disable",

//       // Content Management
//       "sermon:create", "sermon:read", "sermon:update", "sermon:delete", "sermon:destroy",
//       "sermonbite:create", "sermonbite:read", "sermonbite:update", "sermonbite:delete", "sermonbite:destroy",
//       "playlist:create", "playlist:read", "playlist:update", "playlist:delete", "playlist:destroy", "playlist:disable",

//       // Subscription & Transaction Management
//       "subscription:create", "subscription:read", "subscription:update", "subscription:cancel",
//       "transaction:create", "transaction:read", "transaction:update", "transaction:refund",
//       "plan:create", "plan:read", "plan:update", "plan:delete",

//       // API Management
//       "apikey:create", "apikey:read", "apikey:update", "apikey:disable", "apikey:delete",

//       // Analytics & Revenue
//       "analytics:read", "analytics:update", "analytics:export",
//       "revenue:read", "revenue:update",

//       // Advertisement Management
//       "ads:create", "ads:read", "ads:update", "ads:delete"
//     ],
//     [UserType.ADMIN]: [
//       "user:create", "user:read", "user:update", "user:delete", "user:disable",
//       "role:create", "role:read", "role:update", "role:delete", "role:disable",
//       "permission:create", "permission:read", "permission:update", "permission:delete", "permission:disable",
//       "sermon:create", "sermon:read", "sermon:update", "sermon:delete", "sermon:destroy",
//       "sermonbite:create", "sermonbite:read", "sermonbite:update", "sermonbite:delete", "sermonbite:destroy",
//       "playlist:create", "playlist:read", "playlist:update", "playlist:delete", "playlist:destroy", "playlist:disable",
//       "subscription:create", "subscription:read", "subscription:update", "subscription:cancel",
//       "transaction:create", "transaction:read", "transaction:update", "transaction:refund",
//       "plan:create", "plan:read", "plan:update", "plan:delete",
//       "apikey:create", "apikey:read", "apikey:update", "apikey:disable", "apikey:delete",
//       "analytics:read", "analytics:update", "analytics:export",
//       "revenue:read", "revenue:update",
//       "ads:create", "ads:read", "ads:update", "ads:delete"
//     ],
//     [UserType.ORGANISATION]: [
//       "sermon:create", "sermon:read", "sermon:update", "sermon:delete", "sermon:destroy",
//       "sermonbite:create", "sermonbite:read", "sermonbite:update", "sermonbite:delete", "sermonbite:destroy",
//       "playlist:create", "playlist:read", "playlist:update", "playlist:delete", "playlist:destroy", "playlist:disable",
//       "analytics:read", "analytics:export",
//       "user:read", "user:update"
//     ],
//     [UserType.TALENT]: [
//       "sermonbite:create", "sermonbite:read", "sermonbite:update", "sermonbite:delete",
//       "playlist:create", "playlist:read", "playlist:update", "playlist:delete", "playlist:destroy",
//       "analytics:read", "analytics:export",
//       "user:read", "user:update",
//       "sermon:read", "sermonbite:read"
//     ],
//     [UserType.USER]: [
//       "user:read",
//       "sermon:read",
//       "sermonbite:read"
//     ]
//   }

//   /**
//    * @name updatePermissions
//    * @description Updates user permissions while validating against role-based permissions
//    * @param user User object to update
//    * @param permissionPayload New permissions to assign
//    * @returns Updated user object
//    */
//   static async updatePermissions(
//     user: IUserDoc,
//     permissionPayload: IPermissionDTO
//   ): Promise<IResult> {
//     const result: IResult = { error: false, message: "", code: 200, data: {} };

//     const role = await Role.findOne({ slug: user.role });
//     if (!role) {
//       result.error = true;
//       result.message = "Invalid user role";
//       result.code = 400;
//       return result;
//     }

//     const invalidPermissions = permissionPayload.permissions.filter(
//       (p) => !role.permissions.includes(p)
//     );

//     if (invalidPermissions.length > 0) {
//       result.error = true;
//       result.message = `Invalid permissions for role ${
//         role.name
//       }: ${invalidPermissions.join(", ")}`;
//       result.code = 400;
//       return result;
//     }

//     user.role.permissions = permissionPayload.permissions;
//     result.data = user;
//     result.message = "Permissions updated successfully";
//     return result;
//   }


//   /**
//    * @name getRolePermissions
//    * @description Gets all available permissions for a specific role
//    * @param roleSlug Role slug to look up
//    * @returns Array of permissions or null if role not found
//    */
//   static async getRolePermissions(roleSlug: string): Promise<string[] | null> {
//     const role = await Role.findOne({ slug: roleSlug });
//     return role ? role.permissions : null;
//   }

//   /**
//    * @name getAllRoles
//    * @description Returns all available roles and their permissions
//    * @returns Array of role objects
//    */
//   static async getAllRoles(): Promise<any[]> {
//     return Role.find({});
//   }

//   /**
//    * @name hasPermission
//    * @description Checks if a user has a specific permission
//    * @param user User object to check
//    * @param permission Permission to verify
//    * @returns Boolean indicating if user has permission
//    */
//   static hasPermission(user:IUserDoc, permission: string): boolean {
//     if (!user?.role?.permissions) return false;
//     return user.role.permissions?.includes(permission);
//   }

//   /**
//    * @name validateProfilePermissions
//    * @description Validates permissions based on profile type
//    * @param userType User type (listener, preacher, creator, staff)
//    * @param permissions Permissions to validate
//    */
//   static async validateProfilePermissions(
//     userType: UserType,
//     permissions: string[]
//   ): Promise<IResult> {
//     const result: IResult = { error: false, message: "", code: 200, data: {} };

//     const role = await Role.findOne({ name: userType });
//     if (!role) {
//       result.error = true;
//       result.message = `Invalid profile type: ${userType}`;
//       result.code = 400;
//       return result;
//     }

//     const invalidPermissions = permissions.filter(
//       (p) => !role.permissions.includes(p)
//     );
//     if (invalidPermissions.length > 0) {
//       result.error = true;
//       result.message = `Invalid permissions for ${userType}: ${invalidPermissions.join(
//         ", "
//       )}`;
//       result.code = 400;
//       return result;
//     }

//     result.data = { validPermissions: permissions };
//     return result;
//   }

//   /**
//    * @name updateProfilePermissions
//    * @description Updates permissions for a specific profile type
//    * @param userId User ID
//    * @param userType Profile type
//    * @param permissions New permissions to assign
//    */
//   static async updateProfilePermissions(
//     userId: Types.ObjectId,
//     userType: UserType,
//     permissions: string[]
//   ): Promise<IResult> {
//     const result: IResult = { error: false, message: "", code: 200, data: {} };

//     // Validate permissions first
//     const validationResult = await this.validateProfilePermissions(
//       userType,
//       permissions
//     );
//     if (validationResult.error) {
//       return validationResult;
//     }

//     try {
//       // Update permissions based on profile type
//       const updateQuery = { user: userId };
//       const updateData = { permissions };

//       switch (userType) {
//         case UserType.TALENT:
//           // Update listener profile permissions
//           result.data = await Role.findOneAndUpdate(updateQuery, updateData, {
//             new: true,
//           });
//           break;
//         case UserType.ORGANISATION:
//           // Update preacher profile permissions
//           result.data = await Role.findOneAndUpdate(updateQuery, updateData, {
//             new: true,
//           });
//           break;
//         case UserType.ADMIN:
//           // Update staff profile permissions
//           result.data = await Role.findOneAndUpdate(updateQuery, updateData, {
//             new: true,
//           });
//           break;
//         default:
//           result.error = true;
//           result.message = "Invalid profile type";
//           result.code = 400;
//           return result;
//       }

//       result.message = "Profile permissions updated successfully";
//     } catch (error) {
//       result.error = true;
//       result.message = "Failed to update profile permissions";
//       result.code = 500;
//     }

//     return result;
//   }

//   /**
//    * @name hasProfilePermission
//    * @description Checks if a specific profile has a permission
//    * @param profile Profile object to check
//    * @param permission Permission to verify
//    */
//   static hasProfilePermission(profile: any, permission: string): boolean {
//     return profile?.permissions?.includes(permission) || false;
//   }
// }

// export default PermissionService;
