"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Markers
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const satelliteIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/263/263058.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

const CrisisMap = ({ needs = [], govtAlerts = [], onContact, showHeatmap = false }) => {
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        className="h-full w-full"
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri'
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          zIndex={1000}
        />
        <MapResizer />

        {needs.map((need) => {
          const lat = need?.location?.coordinates?.lat || 20.5937;
          const lng = need?.location?.coordinates?.lng || 78.9629;
          return (
          <Marker 
            key={need._id} 
            position={[lat, lng]}
            icon={need.status === 'Resolved' ? greenIcon : need.status === 'Pending' ? yellowIcon : redIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="text-[10px] font-black uppercase text-primary mb-1">{need.category} Report</div>
                <div className="text-sm font-black text-gray-900 mb-2 leading-tight">{need.description}</div>
                <div className="text-[9px] font-bold text-gray-500 uppercase mb-3">{need?.location?.address || 'Unknown Location'}</div>
                {need.image && <div className="rounded-lg overflow-hidden border mb-3"><img src={need.image} className="w-full h-24 object-cover" /></div>}
                <div className="flex justify-between items-center pt-3 border-t">
                   <div className="text-[8px] font-black uppercase text-gray-400">Responders: {need.assignedVolunteers?.length || 0}</div>
                   <button 
                     onClick={() => onContact && onContact(need)}
                     className="px-4 py-2 bg-primary text-white text-[9px] font-black uppercase rounded-lg hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
                   >
                     Contact
                   </button>
                </div>
              </div>
            </Popup>
          </Marker>
        )})}

        {govtAlerts.map((alert, i) => (
          <React.Fragment key={i}>
            <Marker position={[alert.coordinates.lat, alert.coordinates.lng]} icon={satelliteIcon}>
              <Popup>
                <div className="p-2">
                   <div className="text-[10px] font-black text-red-500 uppercase mb-1">Satellite Intel</div>
                   <div className="text-lg font-black uppercase mb-1">{alert.type}</div>
                   <div className="p-2 bg-red-50 text-[9px] font-bold text-red-800 rounded">STATUS: {alert.status}</div>
                </div>
              </Popup>
            </Marker>
            <Circle center={[alert.coordinates.lat, alert.coordinates.lng]} radius={100000} pathOptions={{ color: 'red', fillOpacity: 0.1 }} />
          </React.Fragment>
        ))}

        {/* Feature 2: Predictive AI Heatmap Layer */}
        {showHeatmap && (
          <React.Fragment>
            <Circle center={[28.6139, 77.2090]} radius={300000} pathOptions={{ color: 'red', fillColor: '#ff0000', fillOpacity: 0.15, stroke: false }} />
            <Circle center={[28.6139, 77.2090]} radius={100000} pathOptions={{ color: 'red', fillColor: '#ff0000', fillOpacity: 0.3, stroke: false }} />
            <Circle center={[20.2961, 85.8245]} radius={400000} pathOptions={{ color: 'red', fillColor: '#ff0000', fillOpacity: 0.15, stroke: false }} />
            <Circle center={[19.0760, 72.8777]} radius={200000} pathOptions={{ color: 'red', fillColor: '#ff0000', fillOpacity: 0.25, stroke: false }} />
            <Circle center={[31.1048, 77.1734]} radius={150000} pathOptions={{ color: 'red', fillColor: '#ff0000', fillOpacity: 0.3, stroke: false }} />
          </React.Fragment>
        )}
      </MapContainer>
    </div>
  );
};

export default CrisisMap;
