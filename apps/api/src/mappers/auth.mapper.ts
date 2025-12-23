import { MapActivatedUserDTO, MapRegisteredUserDTO } from "../modules/auth/auth.dto";
import { IUserDoc } from "../utils/interfaces.util";

class AuthMapper {
  constructor() {}

  /**
   * @name mapRegisteredUser
   * @param user - IUserDoc
   * @returns result
   */
  public async mapRegisteredUser(
    user: IUserDoc
  ): Promise<MapRegisteredUserDTO> {
    const result: MapRegisteredUserDTO = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

      phoneNumber: user.phoneNumber,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,

      userType: user.userType,
      isSuper: user.isSuper,
      isAdmin: user.isAdmin,
      isOrganisation: user.isOrganisation,
      isTalent: user.isTalent,

      isActive: user.isActive,
      isLocked: user.isLocked,
      lockedUntil: user.lockedUntil,

      roles: user.roles,
    };

    return result;
  }

  /**
   * @name mapRegisteredUser
   * @param user - IUserDoc
   * @returns result
   */
  public async mapActivatedUser(user: IUserDoc): Promise<MapActivatedUserDTO> {
    const result: MapActivatedUserDTO = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

      phoneNumber: user.phoneNumber,
      country: user.country,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,

      onboard: {
        step: user.onboarding?.isOnboarded ? 3 : 1,
        status: user.onboarding?.isOnboarded ? 'completed' : 'pending'
      },
      status: {
        profile: user.isActive ? 'active' : 'inactive'
      },
      inviteStatus: user.inviteStatus,

      userType: user.userType,
      isSuper: user.isSuper,
      isAdmin: user.isAdmin,
      isOrganisation: user.isOrganisation,
      isTalent: user.isTalent,

      isActive: user.isActive,
      isLocked: user.isLocked,
      lockedUntil: user.lockedUntil,

      roles: user.roles,
    };

    return result;
  }
}

export default new AuthMapper();
