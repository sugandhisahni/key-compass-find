
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Bluetooth, Settings } from 'lucide-react';
import { DeviceProvider, useDevices } from '../context/DeviceContext';
import DeviceCard from '../components/DeviceCard';
import TrackingMap from '../components/TrackingMap';
import ProximityIndicator from '../components/ProximityIndicator';
import SearchModeToggle from '../components/SearchModeToggle';
import AddDeviceModal from '../components/AddDeviceModal';
import { useDeviceTracking } from '../hooks/useDeviceTracking';

const HomePage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { devices, activeDevice, setActiveDevice } = useDevices();
  
  const handleSelectDevice = (deviceId: string) => {
    setActiveDevice(activeDevice?.id === deviceId ? null : deviceId);
  };
  
  const { userLocation, isTracking } = useDeviceTracking(activeDevice?.id || null);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
            <Bluetooth className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold">KeyCompass</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </header>
      
      <main className="flex-1 container px-4 py-6 max-w-4xl mx-auto">
        {/* Device list section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Devices</h2>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Device
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.length === 0 ? (
              <div className="col-span-full p-8 border rounded-lg bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">No devices added yet</p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  Add Your First Device
                </Button>
              </div>
            ) : (
              devices.map(device => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onSelect={handleSelectDevice}
                  isActive={activeDevice?.id === device.id}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Active device details */}
        {activeDevice && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Tracking: {activeDevice.name}</h2>
            
            {/* Map */}
            <div className="h-64 md:h-80 mb-6">
              <TrackingMap 
                deviceId={activeDevice.id} 
                userLocation={userLocation}
              />
            </div>
            
            {/* Controls and info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProximityIndicator deviceId={activeDevice.id} />
              <SearchModeToggle deviceId={activeDevice.id} />
            </div>
          </div>
        )}
      </main>
      
      {/* Add device modal */}
      <AddDeviceModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
};

// Wrap the page with our context provider
const Index = () => (
  <DeviceProvider>
    <HomePage />
  </DeviceProvider>
);

export default Index;
