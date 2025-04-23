
import { useState, useEffect, useRef } from 'react';
import { useDevices } from '../context/DeviceContext';
import { useBluetoothConnection } from './useBluetoothConnection';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useDeviceTracking(deviceId: string | null) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastSignalStrength, setLastSignalStrength] = useState<number | null>(null);
  const { updateDeviceLocation, updateDeviceProximity, devices } = useDevices();
  const { getSignalStrength, calculateDistance } = useBluetoothConnection();
  
  // For tracking interval
  const trackingInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Get user's current location
  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  };

  // Start tracking the device
  const startTracking = () => {
    if (!deviceId) return;
    
    setIsTracking(true);
    getUserLocation(); // Get initial location
    
    // Set up tracking interval
    if (trackingInterval.current) clearInterval(trackingInterval.current);
    
    trackingInterval.current = setInterval(() => {
      // Get updated user location
      getUserLocation();
      
      if (userLocation) {
        // In a real app, this would get actual GPS data from the tracker
        // Here we simulate some randomness around the user's location
        const randomOffset = () => (Math.random() - 0.5) * 0.002; // ~100-200m offset
        
        const device = devices.find(d => d.id === deviceId);
        if (!device) return;
        
        // If device is in Bluetooth range, use RSSI to estimate location
        // This simulates getting more accurate location when closer
        const rssi = getSignalStrength();
        setLastSignalStrength(rssi);
        
        // Calculate approximate distance
        const distance = calculateDistance(rssi);
        
        // Determine proximity level based on distance
        let proximityLevel: 'close' | 'medium' | 'far' | 'unknown';
        if (distance <= 5) proximityLevel = 'close';
        else if (distance <= 20) proximityLevel = 'medium';
        else proximityLevel = 'far';
        
        // Update device proximity
        updateDeviceProximity(deviceId, proximityLevel, distance);
        
        // Apply smaller offset if we're "closer" to the device
        const offsetMultiplier = proximityLevel === 'close' ? 0.2 : 
                               proximityLevel === 'medium' ? 0.6 : 1;
        
        // Update device location with simulated position near user
        updateDeviceLocation(
          deviceId,
          userLocation.latitude + (randomOffset() * offsetMultiplier),
          userLocation.longitude + (randomOffset() * offsetMultiplier)
        );
      }
    }, 2000);
  };

  // Stop tracking
  const stopTracking = () => {
    setIsTracking(false);
    if (trackingInterval.current) {
      clearInterval(trackingInterval.current);
      trackingInterval.current = null;
    }
  };

  // Calculate distance between two coordinates in meters
  const calculateDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Clean up on unmount or when deviceId changes
  useEffect(() => {
    getUserLocation(); // Get initial location
    
    if (deviceId) {
      startTracking();
    }
    
    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, [deviceId]);

  return {
    userLocation,
    isTracking,
    startTracking,
    stopTracking,
    lastSignalStrength,
    calculateDistanceInMeters
  };
}
