import {
  IBulkUser,
  IResult,
  IUserDoc,
} from "../../utils/interfaces.util";
import { dateToday, IDateToday, UIID } from "@btffamily/pacitude";
import {
  UserType,
} from "../../utils/eums.util";
import { createUserDTO } from "../../modules/user/user.dto.ts";
import User from "../../modules/user/user.model.ts";
import PermissionService from "../../services/permission.service.ts";
import talentService from "../../services/talent.service.ts";
import { IPermissionDTO } from "../../dtos/system.dto.ts";
import organizationService from "../../services/organization.service.ts";
import adminService from "../../services/admin.service.ts";
import authService from "../../modules/auth/auth.service.ts";   
import { createTalentDTO } from "../../modules/Talent/talent.dto.ts";
import { createOrganisationDTO } from "../../modules/organization/organization.dto.ts";
import { CreateAdminDTO } from "../../modules/admin/admin.dto.ts";

class UserService {
  public result: IResult;
  public today: IDateToday;

  constructor() {
    this.today = dateToday(new Date());
    this.result = { error: false, message: "", code: 200, data: {} };
  }

  /**
   * @name createUser
   * @param data
   * @returns
   */
  public async createUser(data: createUserDTO): Promise<IUserDoc> {
    const {
      firstName,
      lastName,
      email,
      password,
      userType,
      role,
      permissions,
    } = data;

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create the user object
    let user: IUserDoc = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      userType,
      role,
      permissions,
      passwordType: data.passwordType,
    });

    // Attach role to user based on userType
    await authService.attachRole(user, userType);

    // Handle permissions (if no permissions provided, use a service to create default permissions)
    if (!permissions || permissions.length === 0) {
      const permResult = await PermissionService.initiatePermissionData(user);
      if (permResult.error) {
        throw new Error(permResult.message);
      }
      user = permResult.data as IUserDoc;
    } else {
      const permissionPayload: IPermissionDTO = {
        user: user._id.toString(),
        permissions,
        role: user.role,
      };
      const permissionUpdate = await PermissionService.updatePermissions(
        user,
        permissionPayload
      );
      if (permissionUpdate.error) {
        throw new Error(permissionUpdate.message);
      }

      user = permissionUpdate.data as IUserDoc;
    }

    const talentData: createTalentDTO = {
      user: user,
      type: UserType.TALENT,
    };

    if (user.userType === UserType.TALENT) {
      const talentProfile = await talentService.createTalent(talentData);
      if (talentProfile.error) {
        throw new Error(talentProfile.message);
      }
      user = talentProfile.data.user as IUserDoc;
    }

    if (user.userType === UserType.ORGANISATION) {
      const orgData: createOrganisationDTO = {
        user: user,
        userType: UserType.ORGANISATION,
        email: user.email,
        createdBy: user.id,
      };

      const organizationProfile = await organizationService.createOrganisation(
        orgData
      );

      if (organizationProfile.error) {
        throw new Error(organizationProfile.message);
      }
      user = organizationProfile.data.user as IUserDoc;
    }

    if (user.userType === UserType.ADMIN) {
      const adminData: CreateAdminDTO = {
        user: user,
        userType: UserType.ORGANISATION,
        email: user.email,
      };

      const adminProfile = await adminService.createAdmin(adminData);

      if (adminProfile.error) {
        throw new Error(adminProfile.message);
      }
      user = adminProfile.data.user as IUserDoc;
    }

    await authService.encryptUserPassword(user, password);
    await user.save();

    return user;
  }

  /**
   * @name createBulkUsers
   * @param data
   * @param options
   */
  public async createBulkUsers(
    data: Array<IBulkUser>,
    options: { isNew: boolean }
  ): Promise<void> {
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let bulk: IBulkUser = data[i];
        let password: string = UIID(1).toString();
        let exist = await User.findOne({ email: bulk.email });

        if (!exist && options.isNew) {
          // create the user
          let user = await User.create({
            firstName: bulk.firstName ? bulk.firstName : "",
            lastName: bulk.lastName ? bulk.lastName : "",
            email: bulk.email.toLowerCase(),
            password,
            phoneNumber: bulk.phoneNumber,
            phoneCode: bulk.phoneCode,
          });

          let phone = authService.attachPhoneCode(
            bulk.phoneCode,
            bulk.phoneNumber
          );
          user.countryPhone = phone;
          await user.save();

          // encrypt password
          await authService.encryptUserPassword(user, password);
        }
      }
    }
  }

  /**
   * Gets user notification preferences
   * @param userId - The ID of the user
   * @returns Object containing notification preference settings
   */
  public async getNotificationPreferences(userId: string): Promise<{
    email: boolean;
    push: boolean;
    sms: boolean;
  }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Initialize notification preferences if they don't exist
    if (!user.notificationPreferences) {
      user.notificationPreferences = {
        email: true,
        push: true,
        sms: true
      };
      await user.save();
    }

    return {
      email: user.notificationPreferences.email ?? true,
      push: user.notificationPreferences.push ?? true,
      sms: user.notificationPreferences.sms ?? true,
    };
  }

  /**
   * Updates user notification preferences
   * @param user - The user document
   * @param notificationPreferences - Object containing notification preferences to update
   */
  public async updateNotificationPreferences(
    user: IUserDoc,
    notificationPreferences: Partial<IUserDoc["notificationPreferences"]>
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const hasAnyPreference =
      (notificationPreferences && notificationPreferences.email !== undefined) ||
      (notificationPreferences && notificationPreferences.push !== undefined) ||
      (notificationPreferences && notificationPreferences.sms !== undefined);

    if (!hasAnyPreference) {
      result.error = true;
      result.code = 400;
      result.message =
        "Invalid notification preferences: must provide at least one setting";
      return result;
    }

    // Initialize notification preferences if they don't exist
    if (!user.notificationPreferences) {
      user.notificationPreferences = {
        email: true,
        push: true,
        sms: true
      };
    }

    if (notificationPreferences && notificationPreferences.email !== undefined) {
      user.notificationPreferences.email = notificationPreferences.email;
    }
    if (notificationPreferences && notificationPreferences.push !== undefined) {
      user.notificationPreferences.push = notificationPreferences.push;
    }
    if (notificationPreferences && notificationPreferences.sms !== undefined) {
      user.notificationPreferences.sms = notificationPreferences.sms;
    }

    await user.save();

    result.message = "Notification preferences updated successfully";
    result.data = user.notificationPreferences;

    return result;
  }
}

export default new UserService();