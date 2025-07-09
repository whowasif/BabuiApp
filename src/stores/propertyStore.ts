import { create } from 'zustand';
import { Property } from '../types';
import { mockProperties } from '../data/mockProperties';

interface PropertyStore {
  properties: Property[];
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  removeProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
  getPropertiesByLocation: (lat: number, lng: number, radius: number) => Property[];
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: mockProperties,
  
  addProperty: (property: Property) => {
    set((state) => ({
      properties: [...state.properties, property]
    }));
  },
  
  updateProperty: (id: string, updates: Partial<Property>) => {
    set((state) => ({
      properties: state.properties.map(prop => 
        prop.id === id ? { ...prop, ...updates } : prop
      )
    }));
  },
  
  removeProperty: (id: string) => {
    set((state) => ({
      properties: state.properties.filter(prop => prop.id !== id)
    }));
  },
  
  getProperty: (id: string) => {
    return get().properties.find(prop => prop.id === id);
  },
  
  getPropertiesByLocation: (lat: number, lng: number, radius: number = 5) => {
    const properties = get().properties;
    return properties.filter(property => {
      if (!property.location?.coordinates) return false;
      
      const distance = calculateDistance(
        lat, lng,
        property.location.coordinates.lat,
        property.location.coordinates.lng
      );
      
      return distance <= radius;
    });
  }
}));

// Helper function to calculate distance between two points in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
} 