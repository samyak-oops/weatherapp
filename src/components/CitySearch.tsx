
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Search, MapPin } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { 
  searchCitiesByName, 
  GeocodingData, 
  WeatherError 
} from '@/utils/weatherApi';
import { 
  addRecentCity, 
  getRecentCities, 
  RecentCity 
} from '@/utils/localStorage';

interface CitySearchProps {
  onCitySelect: (lat: number, lon: number, name: string, country: string) => void;
  apiKeyExists: boolean;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect, apiKeyExists }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<GeocodingData[]>([]);
  const [recentCities, setRecentCities] = useState<RecentCity[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const { toast } = useToast();

  // Load recent cities from local storage when component mounts
  useEffect(() => {
    setRecentCities(getRecentCities());
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKeyExists) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenWeatherMap API key first.",
        variant: "destructive"
      });
      return;
    }

    if (!searchInput.trim()) return;

    setIsSearching(true);
    
    try {
      const results = await searchCitiesByName(searchInput.trim());
      setSearchResults(results);
      setShowResults(true);
      
      if (results.length === 0) {
        toast({
          title: "No cities found",
          description: `No cities found matching "${searchInput}".`,
        });
      }
    } catch (error) {
      const weatherError = error as WeatherError;
      toast({
        title: "Search Error",
        description: weatherError.message || "Failed to search for cities",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleCitySelect = (city: GeocodingData | RecentCity) => {
    onCitySelect(city.lat, city.lon, city.name, city.country);
    
    // Add to recent cities
    addRecentCity({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    });
    
    // Update recent cities in state
    setRecentCities(getRecentCities());
    
    // Clear search and hide results
    setSearchInput('');
    setShowResults(false);
  };

  return (
    <div className="weather-card p-4 mb-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-3">Search for a City</h2>
      
      <form onSubmit={handleSearch} className="flex space-x-2 relative mb-3">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter city name..."
          className="flex-1"
          disabled={!apiKeyExists || isSearching}
        />
        <Button 
          type="submit" 
          disabled={!apiKeyExists || isSearching || !searchInput.trim()}
        >
          <Search size={16} className="mr-2" />
          Search
        </Button>
      </form>
      
      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-2">
            <h3 className="text-sm font-medium px-2 py-1 text-gray-500">Search Results</h3>
            <ul className="divide-y divide-gray-100">
              {searchResults.map((city) => (
                <li 
                  key={`${city.lat}-${city.lon}`}
                  className="px-2 py-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <div>
                      <p className="font-medium">{city.name}</p>
                      <p className="text-xs text-gray-500">
                        {city.state ? `${city.state}, ` : ''}{city.country}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {/* Recent Cities */}
      {recentCities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h3>
          <ul className="space-y-1">
            {recentCities.map((city) => (
              <li key={`${city.lat}-${city.lon}`}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left"
                  onClick={() => handleCitySelect(city)}
                >
                  <MapPin size={16} className="mr-2" />
                  <span>{city.name}, {city.country}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CitySearch;
