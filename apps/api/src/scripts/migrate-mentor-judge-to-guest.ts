/**
 * Migration Script: Mentor and Judge to Guest
 *
 * This script migrates all Mentor and Judge records to the unified Guest model.
 *
 * IMPORTANT: Run this script BEFORE removing the mentor and judge modules.
 *
 * Migration steps:
 * 1. Migrate all Mentor records → Guest (type: MENTOR, copy mentorType)
 * 2. Migrate all Judge records → Guest (type: JUDGE)
 * 3. Change createdBy to invitedBy (Guest uses invitedBy)
 * 4. Map all relationships
 *
 * Usage:
 *   ts-node apps/api/src/scripts/migrate-mentor-judge-to-guest.ts
 */

import mongoose from 'mongoose';
import { DbModels } from '../utils/enums.util';
import {
    GuestTypeEnum,
    MentorContextType,
} from '../modules/users/guest/guest.interface';
import ENV from '../utils/env.util';

// Import models
import Mentor from '../modules/users/mentor/mentor.model';
import Judge from '../modules/users/judge/judge.model';
import Guest from '../modules/users/guest/guest.model';

async function migrateMentorsToGuests() {
    console.log('Starting Mentor to Guest migration...');

    const mentors = await Mentor.find({}).lean();
    console.log(`Found ${mentors.length} mentors to migrate`);

    let migrated = 0;
    let errors = 0;

    for (const mentor of mentors) {
        try {
            // Check if guest already exists with this email and type
            const existingGuest = await Guest.findOne({
                email: mentor.email,
                type: GuestTypeEnum.MENTOR,
            });

            if (existingGuest) {
                console.log(
                    `Guest already exists for mentor ${mentor.email}, skipping...`,
                );
                continue;
            }

            // Map mentorType to MentorContextType
            let mentorType: MentorContextType | undefined;
            if (mentor.mentorType) {
                mentorType = mentor.mentorType as MentorContextType;
            }

            // Create guest from mentor
            const guestData: any = {
                code: mentor.code,
                firstName: mentor.firstName,
                lastName: mentor.lastName,
                slug: mentor.slug,
                email: mentor.email,
                bio: mentor.bio || '',
                jobTitle: mentor.jobTitle || '',
                organization: mentor.organization || '',
                areasOfExpertise: mentor.areasOfExpertise || [],
                yearsOfExperience: mentor.yearsOfExperience || '',
                socials: mentor.socials || [],
                image: mentor.image || undefined,
                type: GuestTypeEnum.MENTOR,
                visibility: mentor.visibility || 'public',
                status: mentor.status || 'active',
                inviteStatus: mentor.inviteStatus || 'pending',
                mentorType: mentorType,
                invitedBy: mentor.createdBy, // Change createdBy to invitedBy
                user: mentor.user || undefined,
                settings: mentor.settings || {},
                hackathons: mentor.hackathons || [],
                entries: mentor.entries || [],
                projects: mentor.projects || [],
                workspace: mentor.workspace || [],
                createdAt: mentor.createdAt,
                updatedAt: mentor.updatedAt,
                _version: mentor._version || 0,
            };

            const guest = new Guest(guestData);
            await guest.save();

            migrated++;
            console.log(
                `Migrated mentor ${mentor.email} → Guest (${guest._id})`,
            );
        } catch (error: any) {
            errors++;
            console.error(
                `Error migrating mentor ${mentor.email}:`,
                error.message,
            );
        }
    }

    console.log(
        `Mentor migration complete: ${migrated} migrated, ${errors} errors`,
    );
    return { migrated, errors };
}

async function migrateJudgesToGuests() {
    console.log('Starting Judge to Guest migration...');

    const judges = await Judge.find({}).lean();
    console.log(`Found ${judges.length} judges to migrate`);

    let migrated = 0;
    let errors = 0;

    for (const judge of judges) {
        try {
            // Check if guest already exists with this email and type
            const existingGuest = await Guest.findOne({
                email: judge.email,
                type: GuestTypeEnum.JUDGE,
            });

            if (existingGuest) {
                console.log(
                    `Guest already exists for judge ${judge.email}, skipping...`,
                );
                continue;
            }

            // Create guest from judge
            const guestData: any = {
                code: judge.code,
                firstName: judge.firstName,
                lastName: judge.lastName,
                slug: judge.slug,
                email: judge.email,
                bio: judge.bio || '',
                jobTitle: judge.jobTitle || '',
                organization: judge.organization || '',
                areasOfExpertise: judge.areasOfExpertise || [],
                yearsOfExperience: judge.yearsOfExperience || '',
                socials: judge.socials || [],
                image: judge.image || undefined,
                type: GuestTypeEnum.JUDGE,
                visibility: judge.visibility || 'public',
                status: judge.status || 'active',
                inviteStatus: judge.inviteStatus || 'pending',
                // No mentorType for judges
                invitedBy: judge.createdBy, // Change createdBy to invitedBy
                user: judge.user || undefined,
                settings: judge.settings || {},
                hackathons: judge.hackathons || [],
                // Judges don't have entries
                projects: judge.projects || [],
                workspace: judge.workspace || [],
                createdAt: judge.createdAt,
                updatedAt: judge.updatedAt,
                _version: judge._version || 0,
            };

            const guest = new Guest(guestData);
            await guest.save();

            migrated++;
            console.log(`Migrated judge ${judge.email} → Guest (${guest._id})`);
        } catch (error: any) {
            errors++;
            console.error(
                `Error migrating judge ${judge.email}:`,
                error.message,
            );
        }
    }

    console.log(
        `Judge migration complete: ${migrated} migrated, ${errors} errors`,
    );
    return { migrated, errors };
}

async function updateWorkspaceReferences() {
    console.log('Updating workspace mentor/judge references...');

    const Workspace = mongoose.models[DbModels.WORKSPACE];
    if (!Workspace) {
        console.log(
            'Workspace model not found, skipping workspace reference updates',
        );
        return;
    }

    const workspaces = await Workspace.find({
        $or: [
            { mentors: { $exists: true, $ne: [] } },
            { judges: { $exists: true, $ne: [] } },
        ],
    }).lean();

    console.log(
        `Found ${workspaces.length} workspaces with mentors/judges to update`,
    );

    let updated = 0;
    let errors = 0;

    for (const workspace of workspaces) {
        try {
            const updateData: any = {};

            // Update mentors: find Guest records with matching user IDs
            if (
                workspace.mentors &&
                Array.isArray(workspace.mentors) &&
                workspace.mentors.length > 0
            ) {
                const mentorUserIds = workspace.mentors.map((m: any) =>
                    typeof m === 'object'
                        ? (m._id || m).toString()
                        : m.toString(),
                );

                // Find guests with type MENTOR and matching user IDs
                const mentorGuests = await Guest.find({
                    user: { $in: mentorUserIds },
                    type: GuestTypeEnum.MENTOR,
                })
                    .select('_id')
                    .lean();

                if (mentorGuests.length > 0) {
                    updateData.mentors = mentorGuests.map((g) => g._id);
                }
            }

            // Update judges: find Guest records with matching user IDs
            if (
                workspace.judges &&
                Array.isArray(workspace.judges) &&
                workspace.judges.length > 0
            ) {
                const judgeUserIds = workspace.judges.map((j: any) =>
                    typeof j === 'object'
                        ? (j._id || j).toString()
                        : j.toString(),
                );

                // Find guests with type JUDGE and matching user IDs
                const judgeGuests = await Guest.find({
                    user: { $in: judgeUserIds },
                    type: GuestTypeEnum.JUDGE,
                })
                    .select('_id')
                    .lean();

                if (judgeGuests.length > 0) {
                    updateData.judges = judgeGuests.map((g) => g._id);
                }
            }

            if (Object.keys(updateData).length > 0) {
                await Workspace.updateOne(
                    { _id: workspace._id },
                    { $set: updateData },
                );
                updated++;
                console.log(`Updated workspace ${workspace._id}`);
            }
        } catch (error: any) {
            errors++;
            console.error(
                `Error updating workspace ${workspace._id}:`,
                error.message,
            );
        }
    }

    console.log(
        `Workspace reference update complete: ${updated} updated, ${errors} errors`,
    );
}

async function updateHackathonReferences() {
    console.log('Updating hackathon mentor/judge references...');

    const Hackathon = mongoose.models[DbModels.HACKATHON];
    if (!Hackathon) {
        console.log(
            'Hackathon model not found, skipping hackathon reference updates',
        );
        return;
    }

    const hackathons = await Hackathon.find({
        $or: [
            { mentors: { $exists: true, $ne: [] } },
            { judges: { $exists: true, $ne: [] } },
        ],
    }).lean();

    console.log(
        `Found ${hackathons.length} hackathons with mentors/judges to update`,
    );

    let updated = 0;
    let errors = 0;

    for (const hackathon of hackathons) {
        try {
            const updateData: any = {};

            // Update mentors: find Guest records with matching user IDs
            if (
                hackathon.mentors &&
                Array.isArray(hackathon.mentors) &&
                hackathon.mentors.length > 0
            ) {
                const updatedMentors = await Promise.all(
                    hackathon.mentors.map(async (mentor: any) => {
                        const userId =
                            mentor.user?._id?.toString() ||
                            mentor.user?.toString() ||
                            mentor.user;
                        if (!userId) return mentor;

                        // Find guest with type MENTOR and matching user ID
                        const mentorGuest = await Guest.findOne({
                            user: userId,
                            type: GuestTypeEnum.MENTOR,
                        })
                            .select('_id')
                            .lean();

                        if (mentorGuest) {
                            return {
                                ...mentor,
                                user: mentorGuest._id,
                            };
                        }
                        return mentor;
                    }),
                );
                updateData.mentors = updatedMentors;
            }

            // Update judges: find Guest records with matching user IDs
            if (
                hackathon.judges &&
                Array.isArray(hackathon.judges) &&
                hackathon.judges.length > 0
            ) {
                const updatedJudges = await Promise.all(
                    hackathon.judges.map(async (judge: any) => {
                        const userId =
                            judge.user?._id?.toString() ||
                            judge.user?.toString() ||
                            judge.user;
                        if (!userId) return judge;

                        // Find guest with type JUDGE and matching user ID
                        const judgeGuest = await Guest.findOne({
                            user: userId,
                            type: GuestTypeEnum.JUDGE,
                        })
                            .select('_id')
                            .lean();

                        if (judgeGuest) {
                            return {
                                ...judge,
                                user: judgeGuest._id,
                            };
                        }
                        return judge;
                    }),
                );
                updateData.judges = updatedJudges;
            }

            if (Object.keys(updateData).length > 0) {
                await Hackathon.updateOne(
                    { _id: hackathon._id },
                    { $set: updateData },
                );
                updated++;
                console.log(`Updated hackathon ${hackathon._id}`);
            }
        } catch (error: any) {
            errors++;
            console.error(
                `Error updating hackathon ${hackathon._id}:`,
                error.message,
            );
        }
    }

    console.log(
        `Hackathon reference update complete: ${updated} updated, ${errors} errors`,
    );
}

async function updateEntryReferences() {
    console.log('Updating entry mentor references...');

    const Entry = mongoose.models[DbModels.ENTRY];
    if (!Entry) {
        console.log('Entry model not found, skipping entry reference updates');
        return;
    }

    const entries = await Entry.find({
        mentors: { $exists: true, $ne: [] },
    }).lean();

    console.log(`Found ${entries.length} entries with mentors to update`);

    let updated = 0;
    let errors = 0;

    for (const entry of entries) {
        try {
            if (
                entry.mentors &&
                Array.isArray(entry.mentors) &&
                entry.mentors.length > 0
            ) {
                const mentorUserIds = entry.mentors.map((m: any) =>
                    typeof m === 'object'
                        ? (m._id || m).toString()
                        : m.toString(),
                );

                // Find guests with type MENTOR and matching user IDs
                const mentorGuests = await Guest.find({
                    user: { $in: mentorUserIds },
                    type: GuestTypeEnum.MENTOR,
                })
                    .select('_id')
                    .lean();

                if (mentorGuests.length > 0) {
                    await Entry.updateOne(
                        { _id: entry._id },
                        { $set: { mentors: mentorGuests.map((g) => g._id) } },
                    );
                    updated++;
                    console.log(`Updated entry ${entry._id}`);
                }
            }
        } catch (error: any) {
            errors++;
            console.error(`Error updating entry ${entry._id}:`, error.message);
        }
    }

    console.log(
        `Entry reference update complete: ${updated} updated, ${errors} errors`,
    );
}

async function main() {
    try {
        // Connect to MongoDB
        const mongoUri = ENV.mongoUri || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI not found in environment variables');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Run migrations
        console.log('\n=== Starting Migration ===\n');

        const mentorResult = await migrateMentorsToGuests();
        console.log('\n');

        const judgeResult = await migrateJudgesToGuests();
        console.log('\n');

        await updateWorkspaceReferences();
        console.log('\n');

        await updateHackathonReferences();
        console.log('\n');

        await updateEntryReferences();
        console.log('\n');

        console.log('=== Migration Complete ===');
        console.log(
            `Mentors migrated: ${mentorResult.migrated}, errors: ${mentorResult.errors}`,
        );
        console.log(
            `Judges migrated: ${judgeResult.migrated}, errors: ${judgeResult.errors}`,
        );

        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error: any) {
        console.error('Migration failed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run migration if executed directly
if (require.main === module) {
    main();
}

export default main;
