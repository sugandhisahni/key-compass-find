
import React from 'react';
import { useDevices, type Device } from '../context/DeviceContext';
import { Battery, MapPin, Bluetooth, BluetoothOff, MoreVertical } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DeviceCardProps {
  device: Device;
  onSelect: (id: string) => void;
  isActive: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onSelect, isActive }) => {
  const { toggleSearchMode } = useDevices();
  const formattedDate = device.lastSeen 
    ? new Date(device.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Never';
  
  // Format the battery level display
  const getBatteryIcon = () => {
    if (device.batteryLevel >= 75) return <Battery className="h-4 w-4 text-green-500" />;
    if (device.batteryLevel >= 25) return <Battery className="h-4 w-4 text-yellow-500" />;
    return <Battery className="h-4 w-4 text-red-500" />;
  };
  
  return (
    <div 
      className={`border rounded-lg p-4 transition-all ${
        isActive 
          ? 'bg-primary/5 border-primary' 
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="mr-3">
            {device.connected 
              ? <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bluetooth className="h-4 w-4 text-primary" />
                </div>
              : <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <BluetoothOff className="h-4 w-4 text-gray-500" />
                </div>
            }
          </div>
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>Last seen: {formattedDate}</span>
              {getBatteryIcon()}
              <span className="text-xs">{device.batteryLevel}%</span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      
      {/* Location info */}
      <div className="mb-3 text-sm">
        {device.lastLocation ? (
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">
              Last location available
            </span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>No location data</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex-1 ${device.inSearchMode ? 'bg-accent text-white hover:bg-accent/90' : ''}`}
          onClick={() => toggleSearchMode(device.id)}
        >
          {device.inSearchMode ? 'Stop Search' : 'Search'}
        </Button>
        <Button 
          variant={isActive ? "outline" : "default"} 
          size="sm" 
          className="flex-1"
          onClick={() => onSelect(device.id)}
        >
          {isActive ? 'Hide Details' : 'Track'}
        </Button>
      </div>
    </div>
  );
};

export default DeviceCard;
