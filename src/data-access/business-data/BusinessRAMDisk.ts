import type { Business } from "@/entity/Business";
import Storage from "expo-sqlite/kv-store";

const BUSINESSES_KEY = "businesses";
const MAX_BUSINESSES = 5;

export class BusinessRAMDisk {
  private businesses: Business[] = [];

  async savaBusiness(business: Business): Promise<void> {
    const storedValue = await Storage.getItem(BUSINESSES_KEY);

    const businesses: Business[] =
      storedValue === null ? [] : JSON.parse(storedValue);

    const index = businesses.findIndex(
      (existing) => existing.id === business.id,
    );

    if (index !== -1) {
      businesses[index] = business;
    } else {
      if (businesses.length >= MAX_BUSINESSES) {
        throw new Error("Cannot save more than five businesses");
      }

      businesses.push(business);
    }

    await Storage.setItem(BUSINESSES_KEY, JSON.stringify(businesses));

    this.businesses = businesses;
  }

  async getBusinesses(): Promise<Business[]> {
    const storedValue = await Storage.getItem(BUSINESSES_KEY);

    this.businesses = storedValue === null ? [] : JSON.parse(storedValue);

    return this.businesses;
  }
}
