import { Random } from '@btffamily/pacitude';
import { UserType } from '../modules/users/user/user.interface';

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
        [UserType.SUPERADMIN]: 'sa',
        [UserType.TALENT]: 'tl',
        [UserType.BUSINESS]: 'bs', // Business/Organisation
        [UserType.ADMIN]: 'ad',
        [UserType.USER]: 'ppl',
        // [UserType.TEAM]: "tm",
    };

    const baseName = name[userType] || 'ppl';
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `${baseName}-${year}-${code}`;
};

/**
 * @name genWorkspaceCode
 * @description Generates a unique, standardized identification code for a workspace.
 * @returns {string} A formatted string in the format: ws-{year}-{random_6_digits}.
 * @example
 * // Returns "ws-2025-123456"
 * const code = genWorkspaceCode();
 */
export const genWorkspaceCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `ws-${year}-${code}`;
};

/**
 * @name genProjectCode
 * @description Generates a unique, standardized identification code for a project.
 * @returns {string} A formatted string in format: prj-{year}-{random_6_digits}.
 * @example
 * // Returns "prj-2025-123456"
 * const code = genProjectCode();
 */
export const genProjectCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `prj-${year}-${code}`;
};

//console.log('project', genProjectCode());

/**
 * @name genTaskCode
 * @description Generates a unique, standardized identification code for a task.
 * @returns {string} A formatted string in format: tsk-{year}-{random_6_digits}.
 * @example
 * // Returns "tsk-2025-123456"
 * const code = genTaskCode();
 */
export const genTaskCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `tsk-${year}-${code}`;
};

//console.log('task', genTaskCode());

/**
 * @name genTeamCode
 * @description Generates a unique, standardized identification code for a team.
 * @returns {string} A formatted string in format: tm-{year}-{random_6_digits}.
 * @example
 * // Returns "tm-2025-123456"
 * const code = genTeamCode();
 */
export const genTeamCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `tm-${year}-${code}`;
};

/**
 * @name genGuestCode
 * @description Generates a unique, standardized identification code for a guest.
 * @returns {string} A formatted string in format: gt-{year}-{random_6_digits}.
 * @example
 * // Returns "gt-2025-123456"
 * const code = genGuestCode();
 */
export const genGuestCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `gt-${year}-${code}`;
};

/**
 * @name genHackathonCode
 * @description Generates a unique, standardized identification code for a hackathon.
 * @returns {string} A formatted string in format: hk-{year}-{random_6_digits}.
 * @example
 * // Returns "hk-2025-123456"
 * const code = genHackathonCode();
 */
export const genHackathonCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `hk-${year}-${code}`;
};

/**
 * @name genEntryCode
 * @description Generates a unique, standardized identification code for an entry.
 * @returns {string} A formatted string in format: ent-{year}-{random_6_digits}.
 * @example
 * // Returns "ent-2025-123456"
 * const code = genEntryCode();
 */
export const genEntryCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `ent-${year}-${code}`;
};

/**
 * @name genSquadCode
 * @description Generates a unique, standardized identification code for a squad.
 * @returns {string} A formatted string in format: sqd-{year}-{random_6_digits}.
 * @example
 * // Returns "sqd-2025-123456"
 * const code = genSquadCode();
 */
export const genSquadCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `sqd-${year}-${code}`;
};

/**
 * @name genSubmissionCode
 * @description Generates a unique, standardized identification code for a submission.
 * @returns {string} A formatted string in format: sub-{year}-{random_6_digits}.
 * @example
 * // Returns "sub-2025-123456"
 * const code = genSubmissionCode();
 */
export const genSubmissionCode = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const code = Random.randomNum(6);

    return `sub-${year}-${code}`;
};
