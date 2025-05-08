import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ApiKeyInput from './ApiKeyInput';
import CitySearch from './CitySearch';
import CurrentWeather from './CurrentWeather';
import ForecastWeather from './ForecastWeather';
import { 
  fetchCurrentWeather,
  fetch5DayForecast,
  CurrentWeatherData,
  ForecastData,
  WeatherError
} from '@/utils/weatherApi';
import { getRecentCities, getStoredApiKey } from '@/utils/localStorage';

const WeatherDashboard: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to load weather data for a location
  const loadWeatherData = async (lat: number, lon: number) => {
    if (!apiKey) {
      setError("Please enter your OpenWeatherMap API key");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const currentData = await fetchCurrentWeather(lat, lon, units);
      setCurrentWeather(currentData);

      // Fetch forecast
      const forecastData = await fetch5DayForecast(lat, lon, units);
      setForecast(forecastData);
    } catch (err) {
      const weatherError = err as WeatherError;
      setError(weatherError.message);
      toast({
        title: "Error",
        description: weatherError.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle city selection
  const handleCitySelect = (lat: number, lon: number, name: string, country: string) => {
    loadWeatherData(lat, lon);
  };

  // Handle API key change
  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  // Handle units change
  const handleUnitsChange = (newUnits: 'metric' | 'imperial') => {
    setUnits(newUnits);
    // Reload weather data with new units if we have current weather data
    if (currentWeather) {
      loadWeatherData(
        currentWeather.coord.lat, 
        currentWeather.coord.lon
      );
    }
  };

  // Load last searched city on mount if API key exists
  useEffect(() => {
    if (apiKey) {
      const recentCities = getRecentCities();
      if (recentCities.length > 0) {
        const lastCity = recentCities[0];
        loadWeatherData(lastCity.lat, lastCity.lon);
      }
    }
  }, [apiKey]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Weather Dashboard</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className={units === 'metric' ? 'font-medium' : ''}
              onClick={() => handleUnitsChange('metric')}
            >
              Celsius (°C)
            </DropdownMenuItem>
            <DropdownMenuItem
              className={units === 'imperial' ? 'font-medium' : ''}
              onClick={() => handleUnitsChange('imperial')}
            >
              Fahrenheit (°F)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
          <CitySearch onCitySelect={handleCitySelect} apiKeyExists={!!apiKey} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-weather-purple"></div>
            </div>
          ) : currentWeather ? (
            <>
              <CurrentWeather weather={currentWeather} units={units} />
              {forecast && <ForecastWeather forecast={forecast} units={units} />}
            </>
          ) : apiKey ? (
            <div className="weather-card p-8 text-center">
              <h2 className="text-xl font-medium mb-2">Welcome to Weather Dashboard</h2>
              <p className="text-gray-500">
                Search for a city to see current weather and forecast
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
