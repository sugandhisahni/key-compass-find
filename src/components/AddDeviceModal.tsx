
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import { useBluetoothConnection } from '../hooks/useBluetoothConnection';

interface AddDeviceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState<'scan' | 'connect' | 'name'>('scan');
  const [deviceName, setDeviceName] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  
  const { addDevice } = useDevices();
  const { 
    startScanning, 
    stopScanning, 
    isScanning, 
    discoveredDevices, 
    connectToDevice 
  } = useBluetoothConnection();
  
  const handleStartScan = () => {
    setStep('scan');
    startScanning();
  };
  
  const handleSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    stopScanning();
    setStep('connect');
    
    // Simulate connection process
    setTimeout(() => {
      const device = discoveredDevices.find(d => d.id === deviceId);
      if (device) {
        setDeviceName(device.name);
        setStep('name');
      }
    }, 2000);
  };
  
  const handleAddDevice = () => {
    if (!selectedDeviceId) return;
    
    const newDevice = {
      id: selectedDeviceId,
      name: deviceName.trim() || `Key Tracker ${Math.floor(Math.random() * 100)}`,
      connected: true,
      batteryLevel: Math.floor(Math.random() * 30) + 70, // Random between 70-100%
      lastSeen: new Date(),
      lastLocation: null,
      proximity: 'unknown' as const,
      distanceMeters: null,
      inSearchMode: false
    };
    
    addDevice(newDevice);
    handleClose();
  };
  
  const handleClose = () => {
    stopScanning();
    setStep('scan');
    setSelectedDeviceId(null);
    setDeviceName('');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'scan' && 'Add New Key Tracker'}
            {step === 'connect' && 'Connecting to Device'}
            {step === 'name' && 'Set Device Name'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'scan' && (
          <div className="space-y-4">
            <div className="bg-secondary/50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                Please make sure your Bluetooth is enabled and the key tracker device is nearby.
              </p>
            </div>
            
            {isScanning ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <p className="text-center text-sm">Scanning for nearby devices...</p>
                
                {discoveredDevices.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h3 className="text-sm font-medium">Available devices:</h3>
                    <div className="max-h-60 overflow-y-auto">
                      {discoveredDevices.map((device) => (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-3 border rounded-md mb-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectDevice(device.id)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              <span className="text-primary text-xs">BT</span>
                            </div>
                            <span>{device.name}</span>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button variant="outline" onClick={stopScanning} className="w-full">
                  Cancel Scan
                </Button>
              </div>
            ) : (
              <Button onClick={handleStartScan} className="w-full">
                Start Scanning
              </Button>
            )}
          </div>
        )}
        
        {step === 'connect' && (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium">Connecting to device</p>
              <p className="text-sm text-gray-500">
                {discoveredDevices.find(d => d.id === selectedDeviceId)?.name || 'Selected device'}
              </p>
            </div>
            <p className="text-center text-sm text-gray-500">
              This may take a moment. Please keep the device nearby.
            </p>
          </div>
        )}
        
        {step === 'name' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-center mb-4">Device connected successfully!</p>
            
            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                placeholder="My Keys"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Give your device a name to easily identify it later.
              </p>
            </div>
            
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleAddDevice}>
                Add Device
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceModal;
