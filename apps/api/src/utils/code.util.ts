import { Random } from '@btffamily/pacitude';
import { UserType } from '../modules/user/user.interface';

/**
 * @name genUserCode
 * @description Generates a unique, standardized identification code for a user based on their type.
 * @param {UserType} userType - The classification of the user (e.g., TALENT, BUSINESS, ADMIN).
 * @returns {string} A formatted string in the format: {abbr}-{year}-{random_6_digits}.
 * * @example
 * // Returns "tl-2025-123456"
 * const code = genUserCode(UserType.TALENT);
 */
export const genUserCode = (userType: UserType): string => {
    const name: Record<string, string> = {
        [UserType.TALENT]: 'tl',
        [UserType.BUSINESS]: 'bs', // Business/Organisation
        [UserType.ADMIN]: 'ad',
        [UserType.USER]: 'ppl',
        // [UserType.TEAM]: "tm",
        // [UserType.MENTOR]: "mt",
    };

    const baseName = name[userType] || 'ppl';
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `${baseName}-${year}-${code}`;
};
