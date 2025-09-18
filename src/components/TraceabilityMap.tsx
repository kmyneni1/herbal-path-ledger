import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CollectionEvent } from '@/types/blockchain';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TraceabilityMapProps {
  collectionEvents: CollectionEvent[];
  className?: string;
}

export function TraceabilityMap({ collectionEvents, className = "" }: TraceabilityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([15.3173, 75.7139], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for collection events
    if (collectionEvents.length > 0) {
      const markers: L.Marker[] = [];
      
      collectionEvents.forEach((event, index) => {
        const marker = L.marker([event.gpsLocation.latitude, event.gpsLocation.longitude])
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-primary">${event.species}</h3>
              <p class="text-sm text-muted-foreground">${event.locationName}</p>
              <p class="text-sm">Collector: ${event.collectorName}</p>
              <p class="text-sm">Date: ${event.timestamp.toLocaleDateString()}</p>
              <p class="text-sm">Quality: ${event.qualityMetrics.appearance}</p>
            </div>
          `);
        
        markers.push(marker);
      });

      // Fit map to markers
      if (markers.length === 1) {
        map.setView([collectionEvents[0].gpsLocation.latitude, collectionEvents[0].gpsLocation.longitude], 10);
      } else if (markers.length > 1) {
        const group = new L.FeatureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [collectionEvents]);

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden border border-border ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}