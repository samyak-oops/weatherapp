
// Local storage keys
const API_KEY_STORAGE_KEY = 'openweathermap-api-key';
const RECENT_CITIES_KEY = 'recent-cities';

// API key functions
export const getStoredApiKey = (): string => {
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  // Return the stored key if it exists, otherwise return the default key
  return storedKey || 'cc20179ed3a1f05c01213dce217cbb64';
};

export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

// Recent cities functions
export interface RecentCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export const getRecentCities = (): RecentCity[] => {
  const stored = localStorage.getItem(RECENT_CITIES_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse recent cities from localStorage', e);
    return [];
  }
};

export const addRecentCity = (city: RecentCity): void => {
  const cities = getRecentCities();
  
  // Check if city already exists
  const existingIndex = cities.findIndex(c => 
    c.lat === city.lat && c.lon === city.lon
  );
  
  // If it exists, remove it so we can add to top
  if (existingIndex >= 0) {
    cities.splice(existingIndex, 1);
  }
  
  // Add city to front of array and limit to 5 entries
  cities.unshift(city);
  if (cities.length > 5) {
    cities.pop();
  }
  
  localStorage.setItem(RECENT_CITIES_KEY, JSON.stringify(cities));
};
