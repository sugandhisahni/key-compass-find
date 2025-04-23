
import React from 'react';
import { useDevices } from '../context/DeviceContext';

interface ProximityIndicatorProps {
  deviceId: string;
}

const ProximityIndicator: React.FC<ProximityIndicatorProps> = ({ deviceId }) => {
  const { devices } = useDevices();
  const device = devices.find(d => d.id === deviceId);

  if (!device) {
    return null;
  }

  const { proximity, distanceMeters } = device;
  
  // Determine the visual representation based on proximity
  const getProximityDisplay = () => {
    switch (proximity) {
      case 'close':
        return {
          level: 3,
          text: 'Very Close',
          color: 'bg-green-500',
          barColor: 'bg-green-500',
          message: 'You\'re almost there!'
        };
      case 'medium':
        return {
          level: 2,
          text: 'Nearby',
          color: 'bg-yellow-500',
          barColor: 'bg-yellow-500',
          message: 'Getting closer...'
        };
      case 'far':
        return {
          level: 1,
          text: 'Far',
          color: 'bg-red-500',
          barColor: 'bg-red-500',
          message: 'Keep moving...'
        };
      default:
        return {
          level: 0,
          text: 'Unknown',
          color: 'bg-gray-400',
          barColor: 'bg-gray-400',
          message: 'Signal lost'
        };
    }
  };

  const proximityInfo = getProximityDisplay();
  
  return (
    <div className="w-full p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Proximity</h3>
        <span className={`px-2 py-1 rounded-full text-white text-xs ${proximityInfo.color}`}>
          {proximityInfo.text}
        </span>
      </div>
      
      {/* Signal Strength Bars */}
      <div className="flex gap-1 h-10 items-end mb-3">
        <div className={`w-1/4 rounded-t ${proximityInfo.level >= 1 ? proximityInfo.barColor : 'bg-gray-200'}`} style={{ height: '30%' }}></div>
        <div className={`w-1/4 rounded-t ${proximityInfo.level >= 2 ? proximityInfo.barColor : 'bg-gray-200'}`} style={{ height: '60%' }}></div>
        <div className={`w-1/4 rounded-t ${proximityInfo.level >= 3 ? proximityInfo.barColor : 'bg-gray-200'}`} style={{ height: '100%' }}></div>
      </div>
      
      {/* Distance Display */}
      <div className="flex flex-col">
        <div className="text-center mb-2">
          <span className="text-2xl font-bold">
            {distanceMeters !== null ? `${distanceMeters.toFixed(1)}m` : '—'}
          </span>
          <p className="text-gray-500 text-sm">Approximate Distance</p>
        </div>
        <p className="text-sm text-center text-gray-700">{proximityInfo.message}</p>
      </div>
    </div>
  );
};

export default ProximityIndicator;
