import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Navigation, Crosshair } from 'lucide-react';
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

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  initialLocation?: { lat: number; lng: number };
  height?: string;
}

// Custom marker icon for location picker
const createLocationMarkerIcon = () => {
  return L.divIcon({
    className: 'custom-location-marker',
    html: `
      <div class="relative">
        <div class="w-8 h-8 bg-red-500 border-2 border-white rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

// Map click handler component
const MapClickHandler: React.FC<{
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
}> = ({ onLocationSelect }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const map = useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      
      // Try to get address from coordinates using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        onLocationSelect({ lat, lng, address });
      } catch (error) {
        console.error('Error getting address:', error);
        onLocationSelect({ lat, lng });
      }
    },
  });

  return null;
};

// Add this component to center the map when selectedLocation changes
const MapCenterer: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  height = "400px"
}) => {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(
    initialLocation || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLFormElement | null>(null);

  // Add this effect to sync selectedLocation with initialLocation
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Autocomplete suggestions effect
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setSuggestions([]);
        }
      }
    };
    fetchSuggestions();
    return () => controller.abort();
  }, [searchQuery]);

  // Default center (Dhaka)
  const defaultCenter: [number, number] = [23.8103, 90.4125];

  const handleLocationSelect = (location: { lat: number; lng: number; address?: string }) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get address from coordinates
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            
            const location = { lat: latitude, lng: longitude, address };
            setSelectedLocation(location);
            onLocationSelect(location);
          } catch (error) {
            console.error('Error getting address:', error);
            const location = { lat: latitude, lng: longitude };
            setSelectedLocation(location);
            onLocationSelect(location);
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          // Show error message
          alert(t('location-error', 'অবস্থান পাওয়া যায়নি। অনুগ্রহ করে ম্যানুয়ালি পিন করুন।', 'Location not available. Please pin manually.'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setIsLoading(false);
      alert(t('geolocation-not-supported', 'আপনার ব্রাউজার অবস্থান সেবা সমর্থন করে না।', 'Geolocation is not supported by this browser.'));
    }
  };

  // Search handler (for pressing enter or clicking search button)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setShowSuggestions(false);
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const address = result.display_name;
        handleLocationSelect({ lat, lng, address });
      } else {
        setSearchError('No results found.');
      }
    } catch (error) {
      setSearchError('Error searching location.');
    }
    setSearchLoading(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    setShowSuggestions(false);
    setSearchQuery(suggestion.display_name);
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    const address = suggestion.display_name;
    handleLocationSelect({ lat, lng, address });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t('select-location', 'অবস্থান নির্বাচন করুন', 'Select Location')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('location-instructions', 'ম্যাপে ক্লিক করুন বা আপনার বর্তমান অবস্থান ব্যবহার করুন', 'Click on the map or use your current location')}
          </p>
        </div>
        
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Crosshair size={16} />
          )}
          {t('use-current-location', 'বর্তমান অবস্থান', 'Current Location')}
        </button>
      </div>

      {/* Search Bar with Suggestions */}
      <form ref={searchContainerRef} onSubmit={handleSearch} className="relative flex gap-2 mb-2" autoComplete="off">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Search for a place or address..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          disabled={searchLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
          disabled={searchLoading}
        >
          {searchLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Navigation size={16} />
          )}
        </button>
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-20 left-0 right-12 mt-12 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto min-w-[300px]">
            {suggestions.map((s, idx) => (
              <li
                key={s.place_id}
                className="px-4 py-2 cursor-pointer hover:bg-teal-100 text-sm"
                onMouseDown={() => handleSuggestionClick(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </form>
      {searchError && <div className="text-red-600 text-sm mb-2">{searchError}</div>}

      {/* Map Container */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <MapContainer
          center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : defaultCenter}
          zoom={selectedLocation ? 15 : 12}
          className="w-full"
          style={{ height }}
          minZoom={8}
          maxZoom={18}
          bounds={[[20.7434, 88.0104], [26.6340, 92.6737]]} // Bangladesh bounds
        >
          {/* Center the map when selectedLocation changes */}
          {selectedLocation && <MapCenterer lat={selectedLocation.lat} lng={selectedLocation.lng} />}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Click handler */}
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          
          {/* Selected location marker */}
          {selectedLocation && (
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createLocationMarkerIcon()}
            />
          )}
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-1">
                {t('selected-location', 'নির্বাচিত অবস্থান', 'Selected Location')}
              </h4>
              <p className="text-sm text-green-700 mb-2">
                {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
              </p>
              <div className="text-xs text-green-600">
                {t('coordinates', 'স্থানাঙ্ক', 'Coordinates')}: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Navigation className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              {t('how-to-use', 'কিভাবে ব্যবহার করবেন', 'How to Use')}
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {t('click-map', 'ম্যাপে ক্লিক করুন আপনার সম্পত্তির অবস্থান নির্বাচন করতে', 'Click on the map to select your property location')}</li>
              <li>• {t('use-current', 'বা "বর্তমান অবস্থান" বোতাম ব্যবহার করুন', 'Or use the "Current Location" button')}</li>
              <li>• {t('drag-zoom', 'ম্যাপে ড্র্যাগ এবং জুম করতে পারেন', 'You can drag and zoom the map')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker; 