import { SSSApplication } from "./sss";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockGovService = {
    fetchSSSStatus: async (userId: string): Promise<SSSApplication | null> => {
        await delay(2000);
        return null;
    },

    fetchPhilHealthStatus: async (userId: string): Promise<any> => {
        await delay(2000);
        // Return null to simulate "New User" / Requirements view
        return null;
    },

    fetchDSWDStatus: async (userId: string): Promise<any> => {
        await delay(2000);
        // Return null to simulate "New User" / Programs view
        return null;
    }
};
