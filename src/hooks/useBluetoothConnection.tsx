
import { useState, useEffect } from 'react';

interface BluetoothDeviceInfo {
  id: string;
  name: string;
}

export function useBluetoothConnection() {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if bluetooth is available
  const isBluetoothAvailable = () => {
    // In a real implementation, we would check if the browser/device supports Web Bluetooth
    // For now, we'll simulate this
    return true;
  };

  // Start scanning for devices
  const startScanning = () => {
    if (!isBluetoothAvailable()) {
      setError('Bluetooth is not available on this device');
      return;
    }

    setIsScanning(true);
    setError(null);

    // Simulate discovering devices after a delay
    setTimeout(() => {
      const mockDevices: BluetoothDeviceInfo[] = [
        { id: 'device1', name: 'KeyFinder-A1' },
        { id: 'device2', name: 'KeyFinder-B2' },
        { id: 'device3', name: 'KeyFinder-C3' }
      ];
      setDiscoveredDevices(mockDevices);
      setIsScanning(false);
    }, 2000);

    // In a real implementation, we would use the Web Bluetooth API:
    // navigator.bluetooth.requestDevice({
    //   filters: [{ services: ['battery_service'] }]
    // })
  };

  // Connect to a device
  const connectToDevice = (deviceId: string) => {
    setError(null);
    const device = discoveredDevices.find(d => d.id === deviceId);
    
    if (!device) {
      setError('Device not found');
      return Promise.reject('Device not found');
    }

    // Simulate connecting to the device
    return new Promise<BluetoothDeviceInfo>((resolve, reject) => {
      setTimeout(() => {
        setConnectedDevice(device);
        resolve(device);
      }, 1000);
    });
  };

  // Disconnect from a device
  const disconnectDevice = () => {
    setConnectedDevice(null);
    return Promise.resolve();
  };

  // Get RSSI (signal strength) - simulated
  const getSignalStrength = (): number => {
    // Simulate a signal strength between -100 (weak) and -30 (strong)
    return Math.floor(Math.random() * (-30 - (-100) + 1)) + (-100);
  };

  // Calculate approximate distance based on RSSI
  // This is a very rough estimation and would need calibration in a real app
  const calculateDistance = (rssi: number): number => {
    // A simple model: closer = stronger signal
    // In reality this is much more complex
    const normalized = Math.min(Math.max(rssi + 100, 0), 70) / 70;
    // Convert to a distance between 0.5 and 50 meters
    return 0.5 + (1 - normalized) * 49.5;
  };

  // Stop scanning
  const stopScanning = () => {
    setIsScanning(false);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopScanning();
      if (connectedDevice) {
        disconnectDevice();
      }
    };
  }, []);

  return {
    isScanning,
    discoveredDevices,
    connectedDevice,
    error,
    startScanning,
    stopScanning,
    connectToDevice,
    disconnectDevice,
    getSignalStrength,
    calculateDistance,
  };
}
