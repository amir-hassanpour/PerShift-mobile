import { Business } from "@/entity/Business";
import Storage from "expo-sqlite/kv-store";

const BUSINESSES_KEY = "businesses";
const MAX_BUSINESSES = 5;

type StoredBusiness = {
  id: string;
  name: string;
  lastCheckedIn: string;
};

export class BusinessRAMDisk {
  private businesses: Business[] = [];

  async deleteBusinesses(): Promise<void> {
    await Storage.setItem(BUSINESSES_KEY, JSON.stringify([]));
    this.businesses = [];
  }

  async saveBusiness(business: Business): Promise<void> {
    const storedValue = await Storage.getItem(BUSINESSES_KEY);

    const storedBusinesses: StoredBusiness[] =
      storedValue === null ? [] : JSON.parse(storedValue);

    const businesses: Business[] = storedBusinesses.map(
      (stored) =>
        new Business(stored.id, stored.name, new Date(stored.lastCheckedIn)),
    );

    const index = businesses.findIndex(
      (existing) => existing.id === business.id,
    );

    if (index !== -1) {
      businesses[index] = business;
    } else {
      if (businesses.length >= MAX_BUSINESSES) {
        let oldestIndex = 0;

        for (let i = 1; i < businesses.length; i++) {
          if (
            businesses[i].lastCheckedIn.getTime() <
            businesses[oldestIndex].lastCheckedIn.getTime()
          ) {
            oldestIndex = i;
          }
        }

        businesses.splice(oldestIndex, 1);
      }

      businesses.push(business);
    }

    await Storage.setItem(BUSINESSES_KEY, JSON.stringify(businesses));
    this.businesses = businesses;
  }

  async getMostRecentlyCheckedInBusiness(): Promise<Business | null> {
    const businesses = await this.getBusinesses();

    let mostRecent: Business | null = null;
    let latestTime = -Infinity;

    for (const business of businesses) {
      const checkedIn = new Date(business.lastCheckedIn);
      const time = checkedIn.getTime();

      if (time > latestTime) {
        latestTime = time;
        mostRecent = new Business(business.id, business.name, checkedIn);
      }
    }

    return mostRecent;
  }

  async getBusinesses(): Promise<Business[]> {
    const storedValue = await Storage.getItem(BUSINESSES_KEY);

    this.businesses = storedValue === null ? [] : JSON.parse(storedValue);

    return this.businesses;
  }
}
