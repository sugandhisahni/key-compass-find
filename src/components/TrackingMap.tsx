
import React, { useEffect, useRef } from 'react';
import { useDevices } from '../context/DeviceContext';
import { MapPin, Navigation } from 'lucide-react';

interface MapProps {
  deviceId: string | null;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const TrackingMap: React.FC<MapProps> = ({ deviceId, userLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { devices } = useDevices();
  const device = deviceId ? devices.find(d => d.id === deviceId) : null;

  useEffect(() => {
    // This is where we would initialize a map like Google Maps or Mapbox
    // For this demo, we'll create a simulated map view
    const initMap = () => {
      if (!mapContainerRef.current) return;
      
      const mapContainer = mapContainerRef.current;
      mapContainer.innerHTML = ''; // Clear previous map
      
      // Create simulated map container
      const mapDiv = document.createElement('div');
      mapDiv.className = 'relative w-full h-full bg-blue-50 rounded-lg overflow-hidden';
      mapContainer.appendChild(mapDiv);
      
      // Add a grid to simulate map tiles
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          const tile = document.createElement('div');
          tile.className = 'absolute border border-blue-100';
          tile.style.width = '20%';
          tile.style.height = '20%';
          tile.style.left = `${j * 20}%`;
          tile.style.top = `${i * 20}%`;
          mapDiv.appendChild(tile);
        }
      }
      
      // Add simulated roads
      const roads = [
        { x1: '10%', y1: '0%', x2: '10%', y2: '100%', width: '3px' },
        { x1: '50%', y1: '0%', x2: '50%', y2: '100%', width: '5px' },
        { x1: '90%', y1: '0%', x2: '90%', y2: '100%', width: '3px' },
        { x1: '0%', y1: '30%', x2: '100%', y2: '30%', width: '5px' },
        { x1: '0%', y1: '70%', x2: '100%', y2: '70%', width: '3px' },
        { x1: '20%', y1: '20%', x2: '80%', y2: '80%', width: '3px' },
      ];
      
      roads.forEach(road => {
        const roadEl = document.createElement('div');
        roadEl.className = 'absolute bg-blue-200';
        roadEl.style.height = road.width;
        roadEl.style.width = road.width;
        roadEl.style.left = road.x1;
        roadEl.style.top = road.y1;
        roadEl.style.right = road.x2;
        roadEl.style.bottom = road.y2;
        mapDiv.appendChild(roadEl);
      });
      
      // Add user location marker if available
      if (userLocation) {
        // In a real map, we would convert lat/long to pixel coordinates
        // Here we'll use relative positions based on the demo device and user locations
        const userMarker = document.createElement('div');
        userMarker.className = 'absolute w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center -ml-3 -mt-3';
        userMarker.style.left = '50%';
        userMarker.style.top = '50%';
        mapDiv.appendChild(userMarker);
        
        const userIcon = document.createElement('div');
        userIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="5" y1="12" x2="2" y2="12"/><line x1="22" y1="12" x2="19" y2="12"/></svg>`;
        userMarker.appendChild(userIcon);
      }
      
      // Add device location marker if available
      if (device?.lastLocation) {
        // For demo, position the device relatively to the user
        // In a real map, we would convert lat/long to pixel coordinates
        let offsetX = 0;
        let offsetY = 0;
        const proximity = device.proximity;
        
        if (proximity === 'close') {
          offsetX = 5;
          offsetY = -5;
        } else if (proximity === 'medium') {
          offsetX = 15;
          offsetY = -15;
        } else {
          offsetX = 30;
          offsetY = -30;
        }
        
        const deviceMarker = document.createElement('div');
        deviceMarker.className = `absolute flex items-center justify-center -ml-3 -mt-3 z-20 ${
          device.inSearchMode ? 'pulse-animation' : ''
        }`;
        deviceMarker.style.left = `calc(50% + ${offsetX}%)`;
        deviceMarker.style.top = `calc(50% + ${offsetY}%)`;
        mapDiv.appendChild(deviceMarker);
        
        const markerIconDiv = document.createElement('div');
        markerIconDiv.className = `w-6 h-6 rounded-full flex items-center justify-center 
          ${proximity === 'close' ? 'bg-green-500' : 
            proximity === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`;
        markerIconDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
        deviceMarker.appendChild(markerIconDiv);
        
        // Add a line connecting user and device
        if (userLocation) {
          const connector = document.createElement('div');
          connector.className = 'absolute border-2 border-dashed z-10';
          connector.style.borderColor = proximity === 'close' ? '#10B981' :
                                      proximity === 'medium' ? '#F59E0B' : '#EF4444';
          connector.style.width = '1px';
          connector.style.height = `${Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))}%`;
          connector.style.left = '50%';
          connector.style.top = '50%';
          
          // Calculate rotation angle
          const angle = Math.atan2(offsetY, offsetX) * (180 / Math.PI);
          connector.style.transform = `rotate(${angle}deg)`;
          connector.style.transformOrigin = 'top left';
          
          mapDiv.appendChild(connector);
        }
        
        // Add a label for the device
        const label = document.createElement('div');
        label.className = 'absolute px-2 py-1 text-xs bg-white shadow rounded';
        label.style.left = `calc(50% + ${offsetX}%)`;
        label.style.top = `calc(50% + ${offsetY}% + 12px)`;
        label.textContent = device.name;
        mapDiv.appendChild(label);
      }
    };
    
    initMap();
    
    // Re-initialize when props change
    const updateInterval = setInterval(initMap, 2000);
    
    return () => {
      clearInterval(updateInterval);
    };
  }, [device, userLocation, deviceId]);
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainerRef} className="w-full h-full min-h-[200px]"></div>
      
      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
          <span className="text-lg">+</span>
        </button>
        <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
          <span className="text-lg">−</span>
        </button>
      </div>
      
      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/90 p-2 rounded shadow text-xs">
        <div className="flex items-center gap-1 mb-1">
          <Navigation className="w-3 h-3 text-blue-600" />
          <span>Your location</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-accent" />
          <span>Device location</span>
        </div>
      </div>
    </div>
  );
};

export default TrackingMap;
