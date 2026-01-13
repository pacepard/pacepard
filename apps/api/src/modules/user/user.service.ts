import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import {
    IUserDoc,
    OnboardStatus,
    PasswordType,
    UserType,
} from './user.interface';
import { IResult } from '../../utils/interfaces.util';
import {
    createUserDTO,
    createUserProfileDTO,
    IBulkUser,
} from '../../modules/user/user.dto';
import userRepository from '../../modules/user/user.repository';
import talentService from '../../modules/talents/talent.service';
import talentRepository from '../../modules/talents/talent.repository';
import businessRepository from '../../modules/business/business.repository';
import { GenderType } from '../talents/talent.interface';
import { BusinessType, VerificationType } from '../business/business.interface';
import {
    OnboardStep1DTO,
    OnboardStep2DTO,
    OnboardStep3TalentDTO,
    OnboardStep3BusinessDTO,
} from '../auth/auth.dto';

import authService from '../../modules/auth/auth.service';
import PermissionService from '../permission/permission.service';
import roleService from '../role/role.service';
import businessService from '../business/business.service';
import { genSlug } from '../../utils/helpers.util';
import { genUserCode } from '../../utils/code.util';

type ObjectId = Types.ObjectId;

class UserService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @name createUser
     * @param data
     * @returns
     */
    public async createUser(data: createUserDTO): Promise<IUserDoc> {
        const { email, password, passwordType, userType, createdBy } = data;

        // Check if the user already exists
        const existingUserResult = await userRepository.findOne({
            email: email.toLowerCase(),
        });
        if (existingUserResult.error === false && existingUserResult.data) {
            throw new Error('User already exists');
        }

        let finalPasswordType = passwordType;
        let creatorId = createdBy;

        // TALENT or BUSINESS: Created by self
        if (userType === UserType.USER) {
            finalPasswordType = PasswordType.USERGENERATED;
        }

        // For ADMIN must be created by existing admin/superadmin
        if (userType === UserType.ADMIN) {
            if (!createdBy) {
                throw new Error(
                    'Admin accounts must be created by an existing admin or super admin',
                );
            }
            finalPasswordType = PasswordType.SYSTEMGENERATED;
            creatorId = createdBy;
        }

        // Create the user object
        const createResult = await userRepository.createUser({
            email: email.toLowerCase(),
            password,
            passwordType: finalPasswordType,
            userType: UserType.USER,
            createdBy: creatorId,
            isActivated: false,
            isActive: false,
            onboard: {
                step: 1,
                status: OnboardStatus.NOT_STARTED,
            },
        });

        if (createResult.error) {
            throw new Error(createResult.message);
        }

        let user: IUserDoc = createResult.data as IUserDoc;

        // If it's a self-created account, set createdBy to their own ID
        if (!creatorId) {
            user.createdBy = user._id;
            const updateResult = await userRepository.updateUser(
                String(user._id),
                { createdBy: user._id },
            );
            if (updateResult.error) {
                throw new Error(updateResult.message);
            }
            user = updateResult.data as IUserDoc;
        }

        await authService.encryptUserPassword(user, password);
        await user.save();

        // Initialize roles and permissions based on userType
        // Only initialize if userType is provided and not USER (USER gets role during onboarding)
        if (userType && userType !== UserType.USER) {
            try {
                // Attach role based on userType
                const roleAttachResult = await roleService.attachRole(
                    user,
                    userType,
                );
                if (!roleAttachResult.error) {
                    user = roleAttachResult.data as IUserDoc;

                    // Initialize permissions for the role
                    const permResult =
                        await PermissionService.initiatePermissionData(user);
                    if (!permResult.error) {
                        user = permResult.data as IUserDoc;
                    }
                }
            } catch (error) {
                // Log error but don't fail user creation
                console.error('Failed to initialize roles/permissions:', error);
            }
        }

        return user;
    }

    /**
     * @name createUserProfile
     * @param data
     * @returns
     */
    public async createUserProfile(
        data: createUserProfileDTO,
    ): Promise<IUserDoc> {
        const { email, userType, role, permissions } = data;

        // Check if the user already exists
        const userResult = await userRepository.findOne({
            email: email.toLowerCase(),
        });
        if (userResult.error || !userResult.data) {
            throw new Error(
                'Account not found. Please create an account first.',
            );
        }
        let user = userResult.data as IUserDoc;

        // Update the user's core type
        user.userType = userType;

        // Attach role based on userType
        const roleAttachResult = await roleService.attachRole(user, userType);
        if (roleAttachResult.error) {
            throw new Error(roleAttachResult.message);
        }
        user = roleAttachResult.data as IUserDoc;

        // Initialize permissions (unless custom permissions provided)
        if (!permissions || permissions.length === 0) {
            const permResult =
                await PermissionService.initiatePermissionData(user);
            if (permResult.error) {
                throw new Error(permResult.message);
            }
            user = permResult.data as IUserDoc;
        } else {
            // Update with custom permissions if provided
            const permResult = await PermissionService.updatePermissions(
                user,
                {
                    permissions,
                    role: (user.roles?.[0] as any)?._id || user.roles?.[0],
                },
            );
            if (permResult.error) {
                throw new Error(permResult.message);
            }
            user = permResult.data as IUserDoc;
        }

        // Clear permission cache after role/permission changes
        await PermissionService.clearUserCache(String(user._id));

        // TALENT CHECK & CREATE
        if (user.userType === UserType.TALENT) {
            const existingTalentResult = await talentRepository.findOne({
                user: user._id,
            });
            if (existingTalentResult.error || !existingTalentResult.data) {
                const talentResult = await talentService.createTalent({
                    code: genUserCode(UserType.TALENT),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    user: user,
                    createdBy: String(user._id || user.id),
                });
                if (talentResult.error) {
                    throw new Error(talentResult.message);
                }
                user = talentResult.data.user;

                // Ensure talent user has proper role and permissions
                if (!user.roles || user.roles.length === 0) {
                    const talentRoleResult = await roleService.attachRole(
                        user,
                        UserType.TALENT,
                    );
                    if (!talentRoleResult.error) {
                        user = talentRoleResult.data as IUserDoc;
                        await PermissionService.initiatePermissionData(user);
                        await PermissionService.clearUserCache(String(user._id));
                    }
                }
            }
        }

        // BUSINESS CHECK & CREATE
        if (user.userType === UserType.BUSINESS) {
            const existingOrgResult = await businessRepository.findOne({
                user: user._id,
            });
            if (existingOrgResult.error || !existingOrgResult.data) {
                const orgResult = await businessService.createBusiness({
                    user: user,
                    businessName: '',
                    businessType: BusinessType.COMPANY,
                    industry: '',
                    createdBy: String(user.id),
                });
                if (orgResult.error) {
                    throw new Error(orgResult.message);
                }
                user = orgResult.data.user;

                // Ensure business user has proper role and permissions
                if (!user.roles || user.roles.length === 0) {
                    const businessRoleResult = await roleService.attachRole(
                        user,
                        UserType.BUSINESS,
                    );
                    if (!businessRoleResult.error) {
                        user = businessRoleResult.data as IUserDoc;
                        await PermissionService.initiatePermissionData(user);
                        await PermissionService.clearUserCache(String(user._id));
                    }
                }
            }
        }

        // MENTOR CHECK

        // JUDGE CHECK

        // ADMIN CHECK & CREATE
        // if (user.userType === UserType.ADMIN) {
        //   const existingAdminResult = await adminRepository.findOne({ user: user._id });
        //   if (existingAdminResult.error || !existingAdminResult.data) {
        //     const adminResult = await adminService.createAdmin({
        //         user: user,
        //         email: user.email
        //     });
        //     if (adminResult.error) throw new Error(adminResult.message);
        //     user = adminResult.data.user;
        //   }
        // }
        await user.save();

        return user;
    }

    /**
     * @name createBulkUsers
     * @param data - Array of IBulkUser objects
     * @param options - Options for bulk creation
     * @description Creates multiple users from IBulkUser array. Only uses fields defined in IBulkUser interface.
     */
    public async createBulkUsers(
        data: Array<IBulkUser>,
        options: { isNew: boolean },
    ): Promise<void> {
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const bulk = data[i] as IBulkUser;
                const existResult = await userRepository.findOne({
                    email: bulk.email,
                });

                if ((existResult.error || !existResult.data) && options.isNew) {
                    try {
                        // Create the user using only IBulkUser fields
                        const createResult = await userRepository.createUser({
                            email: bulk.email.toLowerCase(),
                            password: bulk.password,
                            passwordType: bulk.passwordType,
                            userType: bulk.userType,
                            createdBy: bulk.createdBy,
                        });

                        if (createResult.error) {
                            continue; // Skip this user if creation failed
                        }

                        let user = createResult.data as IUserDoc;

                        // Encrypt password
                        await authService.encryptUserPassword(
                            user,
                            bulk.password,
                        );
                        await user.save();

                        // Initialize roles and permissions for bulk users
                        if (bulk.userType && bulk.userType !== UserType.USER) {
                            try {
                                const roleAttachResult = await roleService.attachRole(
                                    user,
                                    bulk.userType,
                                );
                                if (!roleAttachResult.error) {
                                    user = roleAttachResult.data as IUserDoc;
                                    await PermissionService.initiatePermissionData(
                                        user,
                                    );
                                    await PermissionService.clearUserCache(
                                        String(user._id),
                                    );
                                }
                            } catch (error) {
                                // Log but don't fail bulk creation
                                console.error(
                                    `Failed to initialize roles/permissions for ${bulk.email}:`,
                                    error,
                                );
                            }
                        }
                    } catch (error) {
                        // Skip this user if creation failed
                        continue;
                    }
                }
            }
        }
    }

    // onboarding flow
    /**
     * @description Step 1: Set user type
     * @param userId - The user ID
     * @param data - OnboardStep1DTO containing userType
     */
    async step1SetUserType(
        userId: string | ObjectId,
        data: OnboardStep1DTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const userResult = await userRepository.findById(String(userId));
        if (userResult.error || !userResult.data) {
            result.error = true;
            result.message = 'User not found';
            result.code = 404;
            return result;
        }
        let user = userResult.data as IUserDoc;

        // Validate user type
        if (![UserType.TALENT, UserType.BUSINESS].includes(data.userType)) {
            result.error = true;
            result.message = 'Invalid user type';
            result.code = 400;
            return result;
        }

        // Update user type and onboarding step
        user.userType = data.userType;
        user.onboard.step = 1;
        user.onboard.status = OnboardStatus.IN_PROGRESS;

        // Set user type flags
        if (data.userType === UserType.TALENT) {
            user.isTalent = true;
            user.isBusiness = false;
        } else if (data.userType === UserType.BUSINESS) {
            user.isBusiness = true;
            user.isTalent = false;
        }

        // Attach role based on user type
        const roleAttachResult = await roleService.attachRole(
            user,
            data.userType,
        );
        if (roleAttachResult.error) {
            result.error = true;
            result.message = roleAttachResult.message;
            result.code = roleAttachResult.code || 500;
            return result;
        }
        user = roleAttachResult.data as IUserDoc;

        // Initialize permissions for the user
        const permResult = await PermissionService.initiatePermissionData(user);
        if (permResult.error) {
            result.error = true;
            result.message = permResult.message;
            result.code = permResult.code || 500;
            return result;
        }
        user = permResult.data as IUserDoc;

        await user.save();

        result.error = false;
        result.code = 200;
        result.message = 'User type set successfully';
        result.data = {
            userType: user.userType,
            step: user.onboard.step,
            status: user.onboard.status,
        };

        return result;
    }

    /**
     * @description Step 2: Set basic user information
     * @param userId - The user ID
     * @param data - OnboardStep2DTO containing firstName, lastName, location, timeZone
     */
    async step2SetBasicInfo(
        userId: string | Types.ObjectId,
        data: OnboardStep2DTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const userResult = await userRepository.findById(String(userId));
        if (userResult.error || !userResult.data) {
            result.error = true;
            result.message = 'User not found';
            result.code = 404;
            return result;
        }
        let user = userResult.data as IUserDoc;

        // Validate step progression
        if (user.onboard.step < 1) {
            result.error = true;
            result.message = 'Please complete step 1 first';
            result.code = 400;
            return result;
        }

        // Validate required fields
        if (
            !data.firstName ||
            !data.lastName ||
            !data.location.country ||
            !data.timeZone
        ) {
            result.error = true;
            result.message = 'Missing required fields';
            result.code = 400;
            return result;
        }

        // Update user basic information
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.location = {
            phoneCode: data.location.phoneCode || '',
            phoneNumber: data.location.phoneNumber || '',
            address: data.location.address || '',
            city: data.location.city || '',
            state: data.location.state || '',
            country: data.location.country,
            postalCode: data.location.postalCode || '',
        };
        user.timeZone = data.timeZone;
        user.onboard.step = 2;

        await user.save();

        result.error = false;
        result.code = 200;
        result.message = 'Basic information saved successfully';
        result.data = {
            step: user.onboard.step,
            status: user.onboard.status,
        };

        return result;
    }

    /**
     * @description Step 3A: Set talent-specific information
     * @param userId - The user ID
     * @param data - OnboardStep3TalentDTO containing specialty, gender, dateOfBirth
     */
    async step3SetTalentInfo(
        userId: string | Types.ObjectId,
        data: OnboardStep3TalentDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const userResult = await userRepository.findById(String(userId));
        if (userResult.error || !userResult.data) {
            result.error = true;
            result.message = 'User not found';
            result.code = 404;
            return result;
        }
        const user = userResult.data as IUserDoc;

        // Validate user type
        if (user.userType !== UserType.TALENT) {
            result.error = true;
            result.message = 'User is not a talent';
            result.code = 400;
            return result;
        }

        // Validate step progression
        if (user.onboard.step < 2) {
            result.error = true;
            result.message = 'Please complete previous steps first';
            result.code = 400;
            return result;
        }

        // Validate required fields
        if (!data.specialty || !data.gender || !data.dateOfBirth) {
            result.error = true;
            result.message = 'Missing required fields';
            result.code = 400;
            return result;
        }

        // Validate gender enum
        if (!Object.values(GenderType).includes(data.gender)) {
            result.error = true;
            result.message = 'Invalid gender value';
            result.code = 400;
            return result;
        }

        // Validate date of birth (must be valid date and user must be at least 13 years old)
        const birthDate = new Date(data.dateOfBirth);
        if (isNaN(birthDate.getTime())) {
            result.error = true;
            result.message = 'Invalid date of birth';
            result.code = 400;
            return result;
        }

        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (age < 13) {
            result.error = true;
            result.message = 'User must be at least 13 years old';
            result.code = 400;
            return result;
        }

        // Check if talent document already exists
        const talentResult = await talentRepository.findOne({ user: userId });
        let talent: any = null;

        if (talentResult.error === false && talentResult.data) {
            talent = talentResult.data;
            // Update existing talent
            talent.firstName = user.firstName;
            talent.lastName = user.lastName;
            talent.email = user.email;
            talent.specialties = [data.specialty]; // Initialize with single specialty
            talent.gender = data.gender;
            talent.dateOfBirth = data.dateOfBirth;
        } else {
            // Create new talent document
            const talentCreateResult = await talentService.createTalent({
                code: genUserCode(UserType.TALENT),
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                user: user,
                createdBy: String(user._id || user.id),
            });

            if (talentCreateResult.error) {
                result.error = true;
                result.code = talentCreateResult.code;
                result.message = talentCreateResult.message;
                return result;
            }

            talent = talentCreateResult.data.talent;
        }

        // Update existing talent if needed
        if (talent && talentResult.error === false && talentResult.data) {
            const talentId = String((talent as any)._id || (talent as any).id);
            await talentRepository.updateTalent(talentId, {
                specialties: [data.specialty],
                gender: data.gender,
                dateOfBirth: data.dateOfBirth,
            } as any);
        }

        // Update user onboarding step
        user.onboard.step = 3;
        await user.save();

        result.error = false;
        result.code = 200;
        result.message = 'Talent information saved successfully';
        result.data = {
            talent: {
                id: talent.id,
                code: talent.code,
                specialties: talent.specialties || [data.specialty],
            },
            step: user.onboard.step,
            status: user.onboard.status,
        };

        return result;
    }

    /**
     * @description Step 3B: Set business-specific information
     * @param userId - The user ID
     * @param data - OnboardStep3BusinessDTO containing businessName, businessType, industry, tags
     */
    async step3SetBusinessInfo(
        userId: string | Types.ObjectId,
        data: OnboardStep3BusinessDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const userResult = await userRepository.findById(String(userId));
        if (userResult.error || !userResult.data) {
            result.error = true;
            result.message = 'User not found';
            result.code = 404;
            return result;
        }
        const user = userResult.data as IUserDoc;

        // Validate user type
        if (user.userType !== UserType.BUSINESS) {
            result.error = true;
            result.message = 'User is not a BUSINESS';
            result.code = 400;
            return result;
        }

        // Validate step progression
        if (user.onboard.step < 2) {
            result.error = true;
            result.message = 'Please complete previous steps first';
            result.code = 400;
            return result;
        }

        // Validate required fields
        if (!data.businessName || !data.businessType || !data.industry) {
            result.error = true;
            result.message = 'Missing required fields';
            result.code = 400;
            return result;
        }

        // Validate business type enum
        if (!Object.values(BusinessType).includes(data.businessType)) {
            result.error = true;
            result.message = 'Invalid business type';
            result.code = 400;
            return result;
        }

        // Check if business document already exists
        const businessResult = await businessRepository.findOne({
            user: userId,
        });
        let business: any = null;

        if (businessResult.error === false && businessResult.data) {
            business = businessResult.data;
            // Update existing business
            business.firstName = user.firstName;
            business.lastName = user.lastName;
            business.email = user.email;
            business.businessName = data.businessName;
            business.businessType = data.businessType;
            business.industry = data.industry;
            business.tags = data.tags || [];
        } else {
            // Create new business document
            const createBusinessResult =
                await businessRepository.createBusiness({
                    code: genUserCode(UserType.BUSINESS),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    slug: genSlug(data.businessName),
                    email: user.email,
                    businessName: data.businessName,
                    businessType: data.businessType,
                    industry: data.industry,
                    tags: data.tags || [],
                    description: '', // Can be updated later
                    size: '', // Can be updated later
                    website: '', // Can be updated later
                    socials: [],
                    verification: {
                        status: VerificationType.UNVERIFIED,
                        verifiedBy: null,
                        verifiedAt: new Date(),
                        reason: '',
                    },
                    isPublic: false, // Set to true after verification
                    user: userId,
                    createdBy: userId,
                });

            if (createBusinessResult.error) {
                result.error = true;
                result.message = createBusinessResult.message;
                result.code = 400;
                return result;
            }
            business = createBusinessResult.data;
        }

        // Update user onboarding step
        user.onboard.step = 3;
        await user.save();

        result.error = false;
        result.code = 200;
        result.message = 'Business information saved successfully';
        result.data = {
            business: {
                id: business._id,
                code: business.code,
                businessName: business.businessName,
                businessType: business.businessType,
            },
            step: user.onboard.step,
            status: user.onboard.status,
        };

        return result;
    }

    /**
     * @description Step 4: Complete onboarding
     * @param userId - The user ID
     */
    async step4CompleteOnboarding(
        userId: string | Types.ObjectId,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const userResult = await userRepository.findById(String(userId));
        if (userResult.error || !userResult.data) {
            result.error = true;
            result.message = 'User not found';
            result.code = 404;
            return result;
        }
        let user = userResult.data as IUserDoc;

        // Validate step progression
        if (user.onboard.step < 3) {
            result.error = true;
            result.message = 'Please complete all previous steps first';
            result.code = 400;
            return result;
        }

        // Verify that type-specific profile exists
        if (user.userType === UserType.TALENT) {
            const talentResult = await talentRepository.findOne({
                user: userId,
            });
            if (talentResult.error || !talentResult.data) {
                result.error = true;
                result.message =
                    'Talent profile not found. Please complete step 3.';
                result.code = 400;
                return result;
            }
        } else if (user.userType === UserType.BUSINESS) {
            const businessResult = await businessRepository.findOne({
                user: userId,
            });
            if (businessResult.error || !businessResult.data) {
                result.error = true;
                result.message =
                    'Business profile not found. Please complete step 3.';
                result.code = 400;
                return result;
            }
        }

        // Ensure roles and permissions are set before completing onboarding
        if (!user.roles || user.roles.length === 0) {
            const roleAttachResult = await roleService.attachRole(
                user,
                user.userType,
            );
            if (roleAttachResult.error) {
                result.error = true;
                result.message = roleAttachResult.message;
                result.code = roleAttachResult.code || 500;
                return result;
            }
            user = roleAttachResult.data as IUserDoc;
        }

        if (!user.permissions || user.permissions.length === 0) {
            const permResult =
                await PermissionService.initiatePermissionData(user);
            if (permResult.error) {
                result.error = true;
                result.message = permResult.message;
                result.code = permResult.code || 500;
                return result;
            }
            user = permResult.data as IUserDoc;
        }

        // Mark onboarding as completed
        user.onboard.step = 4;
        user.onboard.status = OnboardStatus.COMPLETED;
        user.isActive = true; // Activate user account

        await user.save();

        // Determine redirect URL based on user type
        const redirectUrl =
            user.userType === UserType.TALENT
                ? '/dashboard/talent'
                : '/dashboard/business';

        result.error = false;
        result.code = 200;
        result.message = 'Onboarding completed successfully';
        result.data = {
            step: user.onboard.step,
            status: user.onboard.status,
            redirectUrl,
            userType: user.userType,
        };

        return result;
    }

    /**
     * @description Get current onboarding status
     * @param userId - The user ID
     */
    async getOnboardingStatus(
        userId: string | Types.ObjectId,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const userResult = await userRepository.findById(String(userId));
        if (userResult.error || !userResult.data) {
            result.error = true;
            result.message = 'User not found';
            result.code = 404;
            return result;
        }
        const user = userResult.data as IUserDoc;

        const currentStep = user.onboard.step || 1;
        const status = user.onboard.status || OnboardStatus.NOT_STARTED;
        const totalSteps = 4;

        const progress = {
            completedSteps: currentStep - 1,
            totalSteps,
            percentage: Math.round(((currentStep - 1) / totalSteps) * 100),
        };

        result.error = false;
        result.code = 200;
        result.message = 'Onboarding status retrieved successfully';
        result.data = {
            step: currentStep,
            status,
            progress,
            canProceed:
                status !== OnboardStatus.COMPLETED && currentStep < totalSteps,
            userType: user.userType,
        };

        return result;
    }

    //   /**
    //    * @name createSocialUser
    //    * @description Creates a new user account specifically from a social login profile.
    //    * @param data - Social user data.
    //    * @returns {Promise<IUserDoc>} The newly created user document.
    //    */
    //   public async createSocialUser(data: createSocialUserDTO): Promise<IUserDoc> {

    //     const { firstName, lastName, email, userType, googleId, githubId, appleId } = data;

    //     // 1. Check if user already exists
    //     const existingUser = await userRepository.findByEmail(email.toLowerCase());
    //     if (existingUser) {
    //       throw new Error(existingUser.message);
    //     }

    //     // 2. Create the user object with placeholder password and social ID
    //     let user: IUserDoc = await User.create({
    //       firstName,
    //       lastName,
    //       email: email.toLowerCase(),
    //       password: generateRandomChars(24), // Placeholder.
    //       passwordType: PasswordType.OAUTH,
    //       userType,
    //       googleId: googleId,
    //       githubId: githubId,
    //       appleId: appleId,
    //       isActive: true,
    //       isActivated: true,
    //     });

    //     await authService.updateUserType(user, userType);
    //     await authService.attachRole(user, userType);
    //    const permResult = await PermissionService.initiatePermissionData(user);
    //       if (permResult.error) {
    //         throw new Error(permResult.message);
    //       }
    //       user = permResult.data as IUserDoc;

    //     // 4. Create profile based on userType (REUSE EXISTING LOGIC)

    //     if (user.userType === UserType.LISTENER) {
    //       const listenerProfile = await listenerService.createListener({
    //         user: user,
    //         type: UserType.LISTENER,
    //       });

    //         if (listenerProfile.error) {
    //           throw new Error(listenerProfile.message);
    //         }
    //         user = listenerProfile.data.user as IUserDoc;
    //       }

    //       if (user.userType === UserType.MINISTER) {

    //         const ministerProfile = await ministerService.createMinister({
    //           user: user,
    //           userType: UserType.MINISTER,
    //           email: user.email,
    //         });

    //         if (ministerProfile.error) {
    //           throw new Error(ministerProfile.message);
    //         }
    //         user = ministerProfile.data.user as IUserDoc;
    //       }

    //     // 5. Save the final user (Mongoose pre-save hook will handle password 'encryption' if needed,
    //     // but for social it's a placeholder, so no real encryption runs)
    //     await user.save();

    //     // 6. Send welcome email (REUSED LOGIC FROM YOUR REGISTRATION SUCCESS BLOCK)
    //     const welcomeEmail = await emailService.sendUserWelcomeEmail(user);
    //     if (welcomeEmail.error) {
    //     }

    //     return user;
    //   }

    //   /**
    //    * @name findOrCreateSocialUser
    //    * @description Handles the core logic for social logins: find by ID, find by email, or create new user.
    //    * @param profile - The Passport profile object from the OAuth provider.
    //    * @param provider - 'google', 'github', or 'apple'.
    //    * @returns {Promise<IUserDoc>} The authenticated or newly created user document.
    //    */
    //   public async findOrCreateSocialUser(
    //     profile: IPassportProfileDTO,
    //     provider: OAuthProvider,
    //     req: Request
    //   ): Promise<IUserDoc | null> {

    //     const email = profile.emails?.[0]?.value.toLowerCase();
    //     const socialId = profile.id;
    //     let user: IUserDoc | null = null;

    //     // 1. Check if user already exists via the social ID (Primary check)
    //     const idField = `${provider}Id`; // e.g., 'googleId'
    //     user = await userRepository.findUserBySocialId(provider, socialId)

    //     if (!user) {

    //       // 2. Check if user exists via email (Attempt to link account)
    //       const userResult = await userRepository.findUser(email);

    //       if (!userResult.data) {
    //         throw new Error(userResult.message);
    //       }

    //       user = userResult.data;

    //       if (user) {

    //         user = await this.linkSocialAccount(user, idField, socialId);

    //       } else {
    //         // 3. User not found - CREATE A NEW SOCIAL USER
    //         user = await this.createSocialUser({
    //           firstName: profile.name?.givenName,
    //           lastName: profile.name?.familyName,
    //           email: email,
    //           userType: UserType.LISTENER,
    //           [idField]: socialId, // Add the specific social ID
    //         });
    //       }
    //     }

    //     if (user) {
    //       // 4. Finalize login (REUSE EXISTING LOGIC)
    //       await authService.activateAccount(user);
    //       await authService.updateLastLogin(user);
    //       //await authService.updateLoginInfo(user, req);

    //       user.save()

    //       return user;
    //     }

    //     return null;
    //   }

    // /**
    //    * @name linkSocialAccount
    //    * @description Links a local user account to a social ID.
    //    */
    //   private async linkSocialAccount(user: IUserDoc, idField: string, socialId: string): Promise<IUserDoc> {

    //     const key = idField as SocialIdKey;
    //     user[key] = socialId;
    //     user.passwordType = PasswordType.OAUTH;
    //     await user.save();
    //     return user;
    //   }

    // ============================================
    // ROLE & PERMISSION MANAGEMENT METHODS
    // ============================================

    /**
     * @name getUserRoles
     * @description Get all roles assigned to a user
     * @param userId - User ID
     * @returns Promise<IResult> with array of role documents
     */
    public async getUserRoles(userId: string | ObjectId): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const rolesResult = await roleService.getUserRoles(String(userId));
            if (rolesResult.error) {
                result.error = true;
                result.code = rolesResult.code || 404;
                result.message = rolesResult.message;
                return result;
            }

            result.data = rolesResult.data;
            result.message = 'User roles retrieved successfully';
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message || 'Failed to get user roles';
            return result;
        }
    }

    /**
     * @name getUserPermissions
     * @description Get all resolved permissions for a user (from roles + explicit permissions)
     * @param userId - User ID or user document
     * @returns Promise<IResult> with Set of permission strings
     */
    public async getUserPermissions(
        userId: string | ObjectId | IUserDoc,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const userIdString =
                typeof userId === 'string'
                    ? userId
                    : (userId as IUserDoc)._id
                      ? String((userId as IUserDoc)._id)
                      : String(userId);

            const permissions = await PermissionService.resolveUserPermissions(
                userIdString,
            );

            result.data = Array.from(permissions);
            result.message = 'User permissions retrieved successfully';
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message || 'Failed to get user permissions';
            return result;
        }
    }

    /**
     * @name attachRoleToUser
     * @description Attach a role to a user
     * @param userId - User ID
     * @param roleName - Role name to attach
     * @returns Promise<IResult>
     */
    public async attachRoleToUser(
        userId: string | ObjectId,
        roleName: string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const userResult = await userRepository.findById(String(userId));
            if (userResult.error || !userResult.data) {
                result.error = true;
                result.code = 404;
                result.message = 'User not found';
                return result;
            }

            const user = userResult.data as IUserDoc;
            const roleResult = await roleService.attachRole(user, roleName);

            if (roleResult.error) {
                result.error = true;
                result.code = roleResult.code || 500;
                result.message = roleResult.message;
                return result;
            }

            // Clear permission cache
            await PermissionService.clearUserCache(String(user._id));

            result.data = roleResult.data;
            result.message = roleResult.message || 'Role attached successfully';
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message || 'Failed to attach role';
            return result;
        }
    }

    /**
     * @name detachRoleFromUser
     * @description Detach a role from a user
     * @param userId - User ID
     * @param roleName - Role name to detach
     * @returns Promise<IResult>
     */
    public async detachRoleFromUser(
        userId: string | ObjectId,
        roleName: string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const userResult = await userRepository.findById(String(userId));
            if (userResult.error || !userResult.data) {
                result.error = true;
                result.code = 404;
                result.message = 'User not found';
                return result;
            }

            const user = userResult.data as IUserDoc;
            const roleResult = await roleService.detachRole(user, roleName);

            if (roleResult.error) {
                result.error = true;
                result.code = roleResult.code || 500;
                result.message = roleResult.message;
                return result;
            }

            // Clear permission cache
            await PermissionService.clearUserCache(String(user._id));

            result.data = roleResult.data;
            result.message = roleResult.message || 'Role detached successfully';
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message || 'Failed to detach role';
            return result;
        }
    }

    /**
     * @name checkUserPermission
     * @description Check if a user has a specific permission
     * @param userId - User ID or user document
     * @param permission - Permission string (e.g., 'workspace:create') or object {entity, action}
     * @param options - Optional permission check options (resource, resourceType, checkOwnership, resourceOwnerId)
     * @returns Promise<IResult> with boolean indicating if user has permission
     */
    public async checkUserPermission(
        userId: string | ObjectId | IUserDoc,
        permission: string | { entity: string; action: string },
        options?: {
            resource?: any;
            resourceType?: 'workspace' | 'project' | 'hackathon';
            checkOwnership?: boolean;
            resourceOwnerId?: string | null;
        },
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            let user: IUserDoc | null = null;

            if (typeof userId === 'string' || userId instanceof Types.ObjectId) {
                const userResult = await userRepository.findById(String(userId));
                if (userResult.error || !userResult.data) {
                    result.error = true;
                    result.code = 404;
                    result.message = 'User not found';
                    return result;
                }
                user = userResult.data as IUserDoc;
            } else {
                user = userId as IUserDoc;
            }

            const hasPermission = await PermissionService.hasPermission(
                user,
                permission,
                options,
            );

            result.data = { hasPermission };
            result.message = hasPermission
                ? 'User has permission'
                : 'User does not have permission';
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message || 'Failed to check permission';
            return result;
        }
    }

    /**
     * @name updateUserPermissions
     * @description Update explicit permissions for a user (in addition to role permissions)
     * @param userId - User ID
     * @param permissions - Array of permission strings to assign
     * @param roleId - Optional role ID to validate permissions against
     * @returns Promise<IResult>
     */
    public async updateUserPermissions(
        userId: string | ObjectId,
        permissions: string[],
        roleId?: string | ObjectId,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const userResult = await userRepository.findById(String(userId));
            if (userResult.error || !userResult.data) {
                result.error = true;
                result.code = 404;
                result.message = 'User not found';
                return result;
            }

            const user = userResult.data as IUserDoc;

            // Use PermissionService.updatePermissions which validates against role
            const permResult = await PermissionService.updatePermissions(
                user,
                {
                    permissions,
                    role: roleId || (user.roles?.[0] as any)?._id || user.roles?.[0],
                },
            );

            if (permResult.error) {
                result.error = true;
                result.code = permResult.code || 500;
                result.message = permResult.message;
                return result;
            }

            // Clear permission cache
            await PermissionService.clearUserCache(String(user._id));

            result.data = permResult.data;
            result.message = 'User permissions updated successfully';
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message || 'Failed to update permissions';
            return result;
        }
    }

    /**
     * @name initializeUserPermissions
     * @description Initialize permissions for a user based on their role
     * @param userId - User ID
     * @returns Promise<IResult>
     */
    public async initializeUserPermissions(
        userId: string | ObjectId,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const userResult = await userRepository.findById(String(userId));
            if (userResult.error || !userResult.data) {
                result.error = true;
                result.code = 404;
                result.message = 'User not found';
                return result;
            }

            const user = userResult.data as IUserDoc;

            // Ensure user has a role
            if (!user.roles || user.roles.length === 0) {
                // Attach role based on userType
                const roleAttachResult = await roleService.attachRole(
                    user,
                    user.userType,
                );
                if (roleAttachResult.error) {
                    result.error = true;
                    result.code = roleAttachResult.code || 500;
                    result.message = roleAttachResult.message;
                    return result;
                }
            }

            // Initialize permissions
            const permResult =
                await PermissionService.initiatePermissionData(user);

            if (permResult.error) {
                result.error = true;
                result.code = permResult.code || 500;
                result.message = permResult.message;
                return result;
            }

            // Clear permission cache
            await PermissionService.clearUserCache(String(user._id));

            result.data = permResult.data;
            result.message = 'User permissions initialized successfully';
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message || 'Failed to initialize permissions';
            return result;
        }
    }

    /**
     * @name clearUserPermissionCache
     * @description Clear cached permissions for a user
     * @param userId - User ID
     * @returns Promise<IResult>
     */
    public async clearUserPermissionCache(
        userId: string | ObjectId,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            await PermissionService.clearUserCache(String(userId));
            result.message = 'User permission cache cleared successfully';
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message || 'Failed to clear cache';
            return result;
        }
    }

    /**
     * @name hasUserPermission
     * @description Convenience method to check if user has permission (returns boolean)
     * @param userId - User ID or user document
     * @param permission - Permission string or object
     * @param options - Optional permission check options
     * @returns Promise<boolean>
     */
    public async hasUserPermission(
        userId: string | ObjectId | IUserDoc,
        permission: string | { entity: string; action: string },
        options?: {
            resource?: any;
            resourceType?: 'workspace' | 'project' | 'hackathon';
            checkOwnership?: boolean;
            resourceOwnerId?: string | null;
        },
    ): Promise<boolean> {
        try {
            let user: IUserDoc | null = null;

            if (typeof userId === 'string' || userId instanceof Types.ObjectId) {
                const userResult = await userRepository.findById(String(userId));
                if (userResult.error || !userResult.data) {
                    return false;
                }
                user = userResult.data as IUserDoc;
            } else {
                user = userId as IUserDoc;
            }

            return await PermissionService.hasPermission(user, permission, options);
        } catch (error) {
            return false;
        }
    }
}

export default new UserService();
