
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getStoredApiKey, setApiKey } from '@/utils/localStorage';
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();

  // Load the API key from local storage when the component mounts
  useEffect(() => {
    const storedApiKey = getStoredApiKey();
    setApiKeyState(storedApiKey);
    onApiKeyChange(storedApiKey);
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    setApiKey(apiKey.trim());
    setIsEditing(false);
    onApiKeyChange(apiKey.trim());
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved to local storage.",
    });
  };

  return (
    <div className="weather-card p-4 mb-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-3">OpenWeatherMap API Key</h2>
      
      {isEditing ? (
        <div className="space-y-3">
          <Input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            placeholder="Enter your API key"
            className="w-full"
          />
          <div className="flex gap-2">
            <Button onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
              Save API Key
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setApiKeyState(getStoredApiKey());
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKey ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                API key is set. Weather data will be fetched using your key.
              </p>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Change API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No API key found. Please add your OpenWeatherMap API key to use this app.
                </AlertDescription>
              </Alert>
              <Button onClick={() => setIsEditing(true)}>Add API Key</Button>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          You need an API key from OpenWeatherMap to use this application. 
          Your key will be stored in your browser's local storage.
        </p>
        <p className="mt-2">
          <a 
            href="https://home.openweathermap.org/api_keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Get your free API key here
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;
