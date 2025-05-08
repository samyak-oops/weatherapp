
import { getStoredApiKey } from './localStorage';

// API base URL
const API_BASE = 'https://api.openweathermap.org/data/2.5';
const GEO_API_BASE = 'https://api.openweathermap.org/geo/1.0';

// Weather data interfaces
export interface CurrentWeatherData {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    country: string;
  };
  dt: number; // timestamp
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    clouds: {
      all: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}

export interface GeocodingData {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Error handling
export interface WeatherError {
  code: string;
  message: string;
}

// Function to get the current API key or throw an error if not set
const getApiKey = (): string => {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw {
      code: 'NO_API_KEY',
      message: 'Please enter your OpenWeatherMap API key'
    };
  }
  return apiKey;
};

// Function to fetch current weather data by coordinates
export const fetchCurrentWeather = async (
  lat: number, 
  lon: number, 
  units: 'metric' | 'imperial' = 'metric'
): Promise<CurrentWeatherData> => {
  const apiKey = getApiKey();
  const url = `${API_BASE}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw {
        code: errorData.cod,
        message: errorData.message || 'Failed to fetch weather data'
      };
    }
    return await response.json();
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }
    throw {
      code: 'FETCH_ERROR',
      message: 'Failed to fetch weather data'
    };
  }
};

// Function to fetch 5-day forecast by coordinates
export const fetch5DayForecast = async (
  lat: number, 
  lon: number, 
  units: 'metric' | 'imperial' = 'metric'
): Promise<ForecastData> => {
  const apiKey = getApiKey();
  const url = `${API_BASE}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw {
        code: errorData.cod,
        message: errorData.message || 'Failed to fetch forecast data'
      };
    }
    return await response.json();
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }
    throw {
      code: 'FETCH_ERROR',
      message: 'Failed to fetch forecast data'
    };
  }
};

// Function to search for cities by name
export const searchCitiesByName = async (cityName: string): Promise<GeocodingData[]> => {
  const apiKey = getApiKey();
  const url = `${GEO_API_BASE}/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw {
        code: errorData.cod,
        message: errorData.message || 'Failed to search for cities'
      };
    }
    return await response.json();
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      throw error;
    }
    throw {
      code: 'FETCH_ERROR',
      message: 'Failed to search for cities'
    };
  }
};

// Helper function to convert temperatures
export const kelvinToCelsius = (kelvin: number): number => {
  return kelvin - 273.15;
};

export const kelvinToFahrenheit = (kelvin: number): number => {
  return (kelvin - 273.15) * 9/5 + 32;
};

// Function to get the appropriate background gradient based on weather condition
export const getWeatherBackground = (weatherId: number, isDay: boolean = true): string => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  
  // Thunderstorm: 200-299
  if (weatherId >= 200 && weatherId < 300) {
    return 'bg-stormy-gradient';
  }
  
  // Drizzle: 300-399 or Rain: 500-599
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return 'bg-rainy-gradient';
  }
  
  // Snow: 600-699
  if (weatherId >= 600 && weatherId < 700) {
    return 'bg-cloudy-gradient';
  }
  
  // Atmosphere (fog, mist, etc): 700-799
  if (weatherId >= 700 && weatherId < 800) {
    return 'bg-cloudy-gradient';
  }
  
  // Clear: 800
  if (weatherId === 800) {
    return isDay ? 'bg-sunny-gradient' : 'bg-night-gradient';
  }
  
  // Clouds: 801-899
  return 'bg-cloudy-gradient';
};
