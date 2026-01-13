import logger from '../../utils/logger.util';
import User from '@/modules/user/user.model';
import Role from '@/modules/role/role.model';
import { UserType, PasswordType, OnboardStatus, InviteStatus } from '@/modules/user/user.interface';
import ErrorResponse from '@/utils/error.util';
import authService from '@/modules/auth/auth.service';

/**
 * @name seedUsers
 * @description Seeds the users collection in the database using environment variables
 * @async
 * @function seedUsers
 * @returns {Promise<void>}
 * @throws {ErrorResponse} If required environment variables are missing or role doesn't exist
 */
const seedUsers = async (): Promise<void> => {
    try {
        // Get superadmin credentials from environment variables
        const superAdminEmail = process.env.SUPERADMIN_EMAIL;
        const superAdminPassword = process.env.SUPERADMIN_PASSWORD;
        const superAdminFirstName = process.env.SUPERADMIN_FIRSTNAME;
        const superAdminLastName = process.env.SUPERADMIN_LASTNAME;

        if (!superAdminEmail || !superAdminPassword) {
            throw new ErrorResponse(
                'SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD environment variables are required for seeding',
                400,
                [],
            );
        }

        // Find superadmin role
        const superAdminRole = await Role.findOne({
            name: UserType.SUPERADMIN,
        });
        if (!superAdminRole) {
            throw new ErrorResponse(
                `Role "${UserType.SUPERADMIN}" does not exist. Run role seeding first.`,
                400,
                [],
            );
        }

        // Check if superadmin user already exists
        const existingSuperAdmin = await User.findOne({
            userType: UserType.SUPERADMIN,
        });
        if (existingSuperAdmin) {
            logger.log({
                type: 'info',
                data: `Superadmin user already exists. Skipping.`,
            });
            return;
        }

        // Create superadmin user
        const superAdmin = new User({
            email: superAdminEmail.toLowerCase(),
            firstName: superAdminFirstName,
            lastName: superAdminLastName,
            role: superAdminRole._id,
            userType: UserType.SUPERADMIN,
            passwordType: PasswordType.USERGENERATED,
            isSuper: true,
            isUser: true,
            isAdmin: true,
            isActivated: true,
            isActive: true,
            onboard: {
                step: 0,
                status: OnboardStatus.COMPLETED,
            },
            inviteStatus: InviteStatus.ACCEPTED,
        });

        // Encrypt password and save
        await authService.encryptUserPassword(superAdmin, superAdminPassword);
        await superAdmin.save();

        // Associate user with role
        superAdminRole.users.push(superAdmin._id);
        await superAdminRole.save();

        logger.log({
            type: 'success',
            data: `Superadmin user "${superAdminEmail}" seeded successfully.`,
        });
    } catch (err) {
        logger.log({
            label: 'SEEDING_ERROR',
            type: 'error',
            data: `User seeding failed: ${(err as Error).message}`,
        });
        throw err;
    }
};

export default seedUsers;
