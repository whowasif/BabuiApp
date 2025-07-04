import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ScaleControl } from 'react-leaflet';
import { Layers, Plus, Minus, Maximize2, RotateCcw, Locate, X } from 'lucide-react';
import { Property } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  properties: Property[];
  selectedProperty?: string;
  onPropertySelect?: (propertyId: string) => void;
}

// Custom marker icon for properties
const createPropertyIcon = (isActive: boolean) => {
  return L.divIcon({
    className: 'custom-property-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 bg-white border-2 ${isActive ? 'border-amber-500' : 'border-gray-300'} rounded-full flex items-center justify-center shadow-lg">
          <span class="text-xs font-bold ${isActive ? 'text-amber-600' : 'text-gray-600'}">৳</span>
        </div>
        ${isActive ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white"></div>' : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Cluster marker icon for multiple properties
const createClusterIcon = (count: number) => {
  return L.divIcon({
    className: 'custom-cluster-marker',
    html: `
      <div class="w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center shadow-lg">
        <span class="text-sm font-bold text-gray-800">${count}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Map controls component that uses useMap hook
const MapControls: React.FC<{
  mapStyle: 'default' | 'satellite';
  onToggleMapStyle: () => void;
}> = ({ onToggleMapStyle }) => {
  const { t } = useLanguage();
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  const handleResetPosition = () => {
    map.setView([23.8103, 90.4125], 12); // Dhaka center
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200"
          title={t('zoom-in', 'জুম ইন', 'Zoom In')}
        >
          <Plus size={16} className="text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
          title={t('zoom-out', 'জুম আউট', 'Zoom Out')}
        >
          <Minus size={16} className="text-gray-700" />
        </button>
      </div>

      {/* Map Style Toggle */}
      <button
        onClick={onToggleMapStyle}
        className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title={t('toggle-map-style', 'ম্যাপ স্টাইল পরিবর্তন করুন', 'Toggle Map Style')}
      >
        <Layers size={16} className="text-gray-700" />
      </button>

      {/* Reset Position */}
      <button
        onClick={handleResetPosition}
        className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title={t('reset-position', 'অবস্থান রিসেট করুন', 'Reset Position')}
      >
        <RotateCcw size={16} className="text-gray-700" />
      </button>

      {/* My Location */}
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                map.setView([position.coords.latitude, position.coords.longitude], 15);
              },
              (error) => {
                console.error('Error getting location:', error);
                // Fallback to Dhaka center
                map.setView([23.8103, 90.4125], 12);
              }
            );
          }
        }}
        className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title={t('my-location', 'আমার অবস্থান', 'My Location')}
      >
        <Locate size={16} className="text-gray-700" />
      </button>

      {/* Fullscreen */}
      <button
        onClick={() => {
          const mapContainer = document.querySelector('.leaflet-container');
          if (mapContainer) {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              mapContainer.requestFullscreen();
            }
          }
        }}
        className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title={t('fullscreen', 'ফুলস্ক্রিন', 'Fullscreen')}
      >
        <Maximize2 size={16} className="text-gray-700" />
      </button>
    </div>
  );
};

// Legend component
const MapLegend: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs z-[1000]">
      <div className="text-sm font-semibold text-gray-800 mb-3">
        {t('legend', 'লেজেন্ড', 'Legend')}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-amber-600">
            ৳
          </div>
          <span className="text-xs text-gray-700">
            {t('single-property', 'একক সম্পত্তি', 'Single Property')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-800">
            3
          </div>
          <span className="text-xs text-gray-700">
            {t('multiple-properties', 'একাধিক সম্পত্তি', 'Multiple Properties')}
          </span>
        </div>
      </div>
    </div>
  );
};

const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedProperty,
  onPropertySelect
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useLanguage();
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite'>('default');
  const [showPropertyDetails, setShowPropertyDetails] = useState<string | null>(null);

  // Group properties by location for clustering
  const groupedProperties = properties.reduce((acc, property) => {
    const key = `${Math.round(property.location.coordinates.lat * 1000)}-${Math.round(property.location.coordinates.lng * 1000)}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  // Handle property click
  const handlePropertyClick = (propertyId: string) => {
    setShowPropertyDetails(propertyId);
    onPropertySelect?.(propertyId);
  };

  // Get property for popup
  const getPropertyForPopup = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  const handleToggleMapStyle = () => {
    setMapStyle(mapStyle === 'default' ? 'satellite' : 'default');
  };

  return (
    <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[23.8103, 90.4125]} // Dhaka center
        zoom={12}
        className="w-full h-full"
        style={{ height: '100%' }}
        minZoom={8}
        maxZoom={18}
        bounds={[[20.7434, 88.0104], [26.6340, 92.6737]]} // Bangladesh bounds
      >
        <TileLayer
          key={mapStyle} // Force re-render when map style changes
          url={
            mapStyle === 'satellite'
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution={
            mapStyle === 'satellite'
              ? '&copy; <a href="https://www.esri.com/">Esri</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        />

        {/* Property Markers */}
        {Object.entries(groupedProperties).map(([key, groupProperties]) => {
          const property = groupProperties[0];
          const isCluster = groupProperties.length > 1;
          const isActive = selectedProperty ? groupProperties.some(p => p.id === selectedProperty) : false;

          return (
            <Marker
              key={key}
              position={[property.location.coordinates.lat, property.location.coordinates.lng]}
              icon={isCluster ? createClusterIcon(groupProperties.length) : createPropertyIcon(isActive)}
              eventHandlers={{
                click: () => handlePropertyClick(property.id)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">
                    {isCluster ? `${groupProperties.length} Properties` : property.title}
                  </h3>
                  {!isCluster && (
                    <>
                      <div className="text-lg font-bold text-amber-600 mb-2">
                        ৳{property.price.toLocaleString()}/month
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sqft
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.location.area}, {property.location.city === 'dhaka' ? 'Dhaka' : 'Chittagong'}
                      </div>
                    </>
                  )}
                  {isCluster && (
                    <div className="text-sm text-gray-600">
                      {groupProperties.map(p => (
                        <div key={p.id} className="mb-1">
                          {p.title} - ৳{p.price.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Map Controls */}
        <MapControls
          mapStyle={mapStyle}
          onToggleMapStyle={handleToggleMapStyle}
        />

        {/* Scale Control */}
        <ScaleControl position="bottomleft" />
      </MapContainer>

      {/* Map Legend */}
      <MapLegend />

      {/* Property Details Popup */}
      {showPropertyDetails && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-[1000]">
          {(() => {
            const property = getPropertyForPopup(showPropertyDetails);
            if (!property) return null;
            
            return (
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {property.title}
                  </h3>
                  <button
                    onClick={() => setShowPropertyDetails(null)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="text-lg font-bold text-amber-600 mb-2">
                  ৳{property.price.toLocaleString()}/month
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sqft
                </div>
                <div className="text-xs text-gray-500">
                  {property.location.area}, {property.location.city === 'dhaka' ? 'Dhaka' : 'Chittagong'}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MapView;