
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from 'lucide-react';
import { useDevices } from '../context/DeviceContext';

interface SearchModeToggleProps {
  deviceId: string;
}

const SearchModeToggle: React.FC<SearchModeToggleProps> = ({ deviceId }) => {
  const { devices, toggleSearchMode } = useDevices();
  const device = devices.find(d => d.id === deviceId);

  if (!device) {
    return null;
  }

  return (
    <div className="w-full p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-3">Search Mode</h3>
      
      <div className="flex flex-col items-center space-y-3">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          device.inSearchMode 
            ? 'bg-accent pulse-animation' 
            : 'bg-gray-100'
        }`}>
          {device.inSearchMode ? (
            <Bell className="h-8 w-8 text-white" />
          ) : (
            <BellOff className="h-8 w-8 text-gray-400" />
          )}
        </div>
        
        <p className="text-sm text-center text-gray-500">
          {device.inSearchMode
            ? 'Search mode is active. The device will emit sound and light signals to help you locate it.'
            : 'Activate search mode to make your device emit sound and light signals.'
          }
        </p>
        
        <Button 
          variant={device.inSearchMode ? "destructive" : "default"}
          className="w-full"
          onClick={() => toggleSearchMode(deviceId)}
        >
          {device.inSearchMode ? 'Turn Off Search Mode' : 'Activate Search Mode'}
        </Button>
      </div>
    </div>
  );
};

export default SearchModeToggle;
