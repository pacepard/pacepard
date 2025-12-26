// import { dateToday, IDateToday } from "@btffamily/pacitude";
// import { IAdminDoc } from "./admin.interface";
// import { CreateAdminDTO } from "./admin.dto";
// import adminRepository from "./admin.repository";
// import { IResult } from "../../utils/interfaces.util";
// import { IUserDoc, UserType } from "../user/user.interface";
// import { genSlug } from "../../utils/helpers.util";
// import { genUserCode } from "../../utils/code.util";

// class AdminService {
//   public result: IResult;
//   public today: IDateToday;

//   constructor() {
//     this.today = dateToday(new Date());
//     this.result = { error: false, message: "", code: 200, data: {} };
//   }

//   /**
//    * @method createAdmin
//    * @description Creates a new admin profile in the system.
//    * @param {CreateAdminDTO} data - The admin profile payload.
//    * @returns {Promise<IResult>} A structured result object.
//    */
//   public async createAdmin(
//     data: CreateAdminDTO
//   ): Promise<IResult<{ admin: IAdminDoc; user: IUserDoc }>> {
    
//     let result: IResult<{ admin: IAdminDoc; user: IUserDoc }> = {
//       error: false,
//       message: "",
//       code: 200,
//       data: {} as { admin: IAdminDoc; user: IUserDoc },
//     };

//     const {
//       user,
//       email,
//       firstName,
//       lastName,
//       createdBy,
//     } = data;

//     if (!user) {
//       result.error = true;
//       result.code = 400;
//       result.message = "User information is required to create an admin profile";
//       return result;
//     }

//     const existingAdminResult = await adminRepository.findOne({ user: user._id || user.id });
//     if (existingAdminResult.error === false && existingAdminResult.data) {
//       result.error = true;
//       result.code = 400;
//       result.message = "Admin profile already exists for this user";
//       return result;
//     }

//     const adminData = {
//       code: genUserCode(UserType.ADMIN),
//       firstName: firstName || user.firstName,
//       lastName: lastName || user.lastName,
//       email: email || user.email,
//       slug: genSlug(`${firstName || user.firstName} ${lastName || user.lastName}`),
      
//       // Relationships
//       user: user._id || user.id,
//       createdBy: createdBy || user._id || user.id,
      
//       // Default values
//       department: '',
//       position: '',
//       accessLevel: 1,
//       accessLevelName: '',
//       accessLevelDescription: '',
//       activityLog: [],
//     };

//     const createResult = await adminRepository.createAdmin(adminData);
//     if (createResult.error || !createResult.data) {
//       result.error = true;
//       result.code = 500;
//       result.message = createResult.message || "Failed to create admin profile";
//       return result;
//     }

//     result.message = "Admin profile created successfully";
//     result.code = 201;
//     result.data = { admin: createResult.data as IAdminDoc, user };
//     return result;
//   }
// }

// export default new AdminService();
