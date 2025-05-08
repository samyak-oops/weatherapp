
import React from 'react';
import { 
  CloudDrizzle, 
  CloudFog, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  Cloud, 
  CloudSun, 
  Sun, 
  Wind,
  LucideProps
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  weatherCode: number;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  weatherCode, 
  size = 24,
  ...props 
}) => {
  // Function to determine which icon to show based on weather code
  // Using OpenWeatherMap weather condition codes: https://openweathermap.org/weather-conditions
  
  // Thunderstorm: 200-299
  if (weatherCode >= 200 && weatherCode < 300) {
    return <CloudLightning size={size} {...props} />;
  }
  
  // Drizzle: 300-399
  if (weatherCode >= 300 && weatherCode < 400) {
    return <CloudDrizzle size={size} {...props} />;
  }
  
  // Rain: 500-599
  if (weatherCode >= 500 && weatherCode < 600) {
    return <CloudRain size={size} {...props} />;
  }
  
  // Snow: 600-699
  if (weatherCode >= 600 && weatherCode < 700) {
    return <CloudSnow size={size} {...props} />;
  }
  
  // Atmosphere (fog, mist, etc): 700-799
  if (weatherCode >= 700 && weatherCode < 800) {
    return <CloudFog size={size} {...props} />;
  }
  
  // Clear: 800
  if (weatherCode === 800) {
    return <Sun size={size} {...props} />;
  }
  
  // Clouds: 801-899
  if (weatherCode > 800 && weatherCode < 900) {
    // Few clouds
    if (weatherCode === 801) {
      return <CloudSun size={size} {...props} />;
    }
    // More clouds
    return <Cloud size={size} {...props} />;
  }
  
  // Wind and other extremes
  if (weatherCode >= 900) {
    return <Wind size={size} {...props} />;
  }
  
  // Default
  return <Cloud size={size} {...props} />;
};

export default WeatherIcon;
