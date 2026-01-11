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
import PermissionService from '../../services/permission.service';
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

        // Update the user's core type and roles
        user.userType = userType;
        if (role) user.role = role;

        // Attach Roles & Permissions logic
        await authService.attachRole(user, userType);

        if (!permissions || permissions.length === 0) {
            const permResult =
                await PermissionService.initiatePermissionData(user);
            if (permResult.error) throw new Error(permResult.message);
            user = permResult.data as IUserDoc;
        }

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
                if (talentResult.error) throw new Error(talentResult.message);
                user = talentResult.data.user;
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
                if (orgResult.error) throw new Error(orgResult.message);
                user = orgResult.data.user;
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
                let bulk: IBulkUser = data[i];
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
        const user = userResult.data as IUserDoc;

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
        const user = userResult.data as IUserDoc;

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
        const user = userResult.data as IUserDoc;

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
}

export default new UserService();
