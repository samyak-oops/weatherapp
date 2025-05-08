import React, { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { format } from 'date-fns';
import WeatherIcon from './WeatherIcon';
import { ForecastData } from '@/utils/weatherApi';

interface ForecastWeatherProps {
  forecast: ForecastData;
  units: 'metric' | 'imperial';
}

const ForecastWeather: React.FC<ForecastWeatherProps> = ({ forecast, units }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  
  // Process forecast data to get one forecast per day
  const dailyForecasts = useMemo(() => {
    // Use a Map to store one forecast per day
    const dailyMap = new Map();
    
    forecast.list.forEach(item => {
      // Extract date (without time)
      const date = item.dt_txt.split(' ')[0];
      
      // Extract just the day from the date
      const day = new Date(item.dt * 1000).getDate();
      
      // Only keep one forecast per day, preferably around noon
      const hour = new Date(item.dt * 1000).getHours();
      
      // If we haven't stored this day yet or this is the noon forecast, store it
      if (!dailyMap.has(day) || (hour >= 12 && hour <= 15)) {
        dailyMap.set(day, item);
      }
    });
    
    // Convert map to array, sorted by date
    return Array.from(dailyMap.values())
      .sort((a, b) => a.dt - b.dt)
      .slice(0, 5); // Keep only the first 5 days
  }, [forecast]);

  return (
    <Card className="weather-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          {dailyForecasts.map(day => {
            const date = new Date(day.dt * 1000);
            const weather = day.weather[0];
            
            return (
              <div 
                key={day.dt} 
                className="py-3 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-24">
                    <div className="font-medium">
                      {format(date, 'EEE')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(date, 'MMM d')}
                    </div>
                  </div>
                  <WeatherIcon 
                    weatherCode={weather.id} 
                    size={36} 
                    className="text-weather-purple" 
                  />
                </div>
                
                <div className="text-right">
                  <div className="text-sm capitalize">{weather.description}</div>
                  <div className="font-medium">
                    {Math.round(day.main.temp_max)}{tempUnit} / {Math.round(day.main.temp_min)}{tempUnit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastWeather;
