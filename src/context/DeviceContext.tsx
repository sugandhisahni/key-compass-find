
import React, { createContext, useState, useContext } from 'react';

export interface Device {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel: number;
  lastSeen: Date | null;
  lastLocation: {
    latitude: number;
    longitude: number;
  } | null;
  proximity: 'close' | 'medium' | 'far' | 'unknown';
  distanceMeters: number | null;
  inSearchMode: boolean;
}

interface DeviceContextType {
  devices: Device[];
  activeDevice: Device | null;
  addDevice: (device: Device) => void;
  removeDevice: (id: string) => void;
  setActiveDevice: (id: string | null) => void;
  updateDeviceLocation: (id: string, latitude: number, longitude: number) => void;
  updateDeviceProximity: (id: string, proximity: Device['proximity'], distanceMeters: number | null) => void;
  toggleSearchMode: (id: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([
    // Example device for development
    {
      id: '1',
      name: 'My Keys',
      connected: true,
      batteryLevel: 75,
      lastSeen: new Date(),
      lastLocation: {
        latitude: 37.7749,
        longitude: -122.4194
      },
      proximity: 'medium',
      distanceMeters: 24,
      inSearchMode: false
    }
  ]);
  
  const [activeDevice, setActiveDeviceState] = useState<Device | null>(null);

  const addDevice = (device: Device) => {
    setDevices([...devices, device]);
  };

  const removeDevice = (id: string) => {
    setDevices(devices.filter(device => device.id !== id));
    if (activeDevice?.id === id) {
      setActiveDeviceState(null);
    }
  };

  const setActiveDevice = (id: string | null) => {
    if (id === null) {
      setActiveDeviceState(null);
      return;
    }
    
    const device = devices.find(d => d.id === id);
    if (device) {
      setActiveDeviceState(device);
    }
  };

  const updateDeviceLocation = (id: string, latitude: number, longitude: number) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { 
            ...device, 
            lastSeen: new Date(), 
            lastLocation: { latitude, longitude } 
          } 
        : device
    ));

    if (activeDevice?.id === id) {
      setActiveDeviceState(prev => prev ? { 
        ...prev, 
        lastSeen: new Date(), 
        lastLocation: { latitude, longitude } 
      } : null);
    }
  };

  const updateDeviceProximity = (id: string, proximity: Device['proximity'], distanceMeters: number | null) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { ...device, proximity, distanceMeters } 
        : device
    ));

    if (activeDevice?.id === id) {
      setActiveDeviceState(prev => 
        prev ? { ...prev, proximity, distanceMeters } : null
      );
    }
  };

  const toggleSearchMode = (id: string) => {
    setDevices(devices.map(device => 
      device.id === id 
        ? { ...device, inSearchMode: !device.inSearchMode } 
        : device
    ));

    if (activeDevice?.id === id) {
      setActiveDeviceState(prev => 
        prev ? { ...prev, inSearchMode: !prev.inSearchMode } : null
      );
    }
  };

  const value = {
    devices,
    activeDevice,
    addDevice,
    removeDevice,
    setActiveDevice,
    updateDeviceLocation,
    updateDeviceProximity,
    toggleSearchMode,
  };

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};
