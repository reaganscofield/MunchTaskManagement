import { Tag } from "./models/Tag";
import { logger } from "../config/logger";

export async function seedInitialData() {
    try {
        const existingTags = await Tag.count();
        if (existingTags === 0) {
            logger.info('No tags found, seeding initial tag data...');
            const initialTags = [
                { name: "Important" },
                { name: "Urgent" },
                { name: "Work" },
                { name: "Personal" },
                { name: "Shopping" },
                { name: "Health" },
                { name: "Finance" },
                { name: "Learning" },
                { name: "Travel" },
                { name: "Family" }
            ];
            await Tag.bulkCreate(initialTags);
            logger.info(`Successfully seeded ${initialTags.length} initial tags`);
        } else {
            logger.info(`Tags already exist (${existingTags} found), skipping seed data`);
        }
    } catch (error) {
        logger.error('Error seeding initial data:', error);
        throw error;
    }
}