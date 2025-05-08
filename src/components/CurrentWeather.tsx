
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Droplet, 
  Wind, 
  Gauge, 
  ThermometerSun, 
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import WeatherIcon from './WeatherIcon';
import { CurrentWeatherData, getWeatherBackground } from '@/utils/weatherApi';

interface CurrentWeatherProps {
  weather: CurrentWeatherData;
  units: 'metric' | 'imperial';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather, units }) => {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';
  const weatherMain = weather.weather[0];
  const weatherBackground = getWeatherBackground(weatherMain.id);
  
  return (
    <Card className={`overflow-hidden animate-fade-in ${weatherBackground}`}>
      <CardHeader className="text-white bg-black bg-opacity-20 backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl flex items-center">
              <span>{weather.name}</span>
              <span className="text-sm ml-2">{weather.sys.country}</span>
            </CardTitle>
            <CardDescription className="text-white text-opacity-90 flex items-center">
              <MapPin size={14} className="mr-1" />
              Updated {format(new Date(weather.dt * 1000), 'h:mm a | EEE, MMM d')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WeatherIcon 
              weatherCode={weatherMain.id} 
              size={64} 
              className="text-white" 
            />
            <div className="ml-4">
              <div className="text-5xl font-bold">
                {Math.round(weather.main.temp)}{tempUnit}
              </div>
              <div className="text-lg font-medium capitalize">
                {weatherMain.description}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">
              Feels like {Math.round(weather.main.feels_like)}{tempUnit}
            </div>
            <div className="flex items-center justify-end mt-1 text-sm">
              <ThermometerSun size={14} className="mr-1" />
              <span>{Math.round(weather.main.temp_min)}{tempUnit}</span>
              <span className="mx-1">~</span>
              <span>{Math.round(weather.main.temp_max)}{tempUnit}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2 p-4 bg-black bg-opacity-20 text-white">
        <div className="flex flex-col items-center">
          <Droplet size={18} className="mb-1" />
          <div className="text-sm font-medium">{weather.main.humidity}%</div>
          <div className="text-xs">Humidity</div>
        </div>
        <div className="flex flex-col items-center">
          <Wind size={18} className="mb-1" />
          <div className="text-sm font-medium">{Math.round(weather.wind.speed)} {windUnit}</div>
          <div className="text-xs">Wind</div>
        </div>
        <div className="flex flex-col items-center">
          <Gauge size={18} className="mb-1" />
          <div className="text-sm font-medium">{weather.main.pressure} hPa</div>
          <div className="text-xs">Pressure</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurrentWeather;
