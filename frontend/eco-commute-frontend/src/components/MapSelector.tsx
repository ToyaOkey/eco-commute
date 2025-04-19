import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useState, useEffect } from 'react';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  onSelect: (start: [number, number], dest: [number, number]) => void;
};

const AutoFocusMap = () => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    map.flyTo([35.2271, -80.8431], 13);
  }, []);

  return null;
};

const MapSelector = ({ onSelect }: Props) => {
  const [clicks, setClicks] = useState<[number, number][]>([]);
  const [addresses, setAddresses] = useState<{ start?: string; dest?: string }>({});
  const [distance, setDistance] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      return data.display_name || 'Unknown location';
    } catch {
      return 'Failed to load location';
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        if (isLocked) return;

        const latlng: [number, number] = [e.latlng.lat, e.latlng.lng];
        const updated = [...clicks, latlng].slice(-2);
        setClicks(updated);

        if (updated.length === 1) {
          const addr = await reverseGeocode(latlng[0], latlng[1]);
          setAddresses({ start: addr });
        }

        if (updated.length === 2) {
          const [start, dest] = updated;
          const [startAddr, destAddr] = await Promise.all([
            reverseGeocode(start[0], start[1]),
            reverseGeocode(dest[0], dest[1]),
          ]);
          setAddresses({ start: startAddr, dest: destAddr });

          const dist = calculateDistance(start[0], start[1], dest[0], dest[1]);
          setDistance(dist);
          setIsLocked(true);
          onSelect(start, dest);
        }
      },
    });
    return null;
  };

  const resetPoints = () => {
    setClicks([]);
    setAddresses({});
    setDistance(null);
    setIsLocked(false);
    onSelect([0, 0], [0, 0]);
  };

  const formatCoord = (coord: [number, number]) =>
    `${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}`;

  return (
    <section id="map" className="my-6 scroll-mt-24">
      <h3 className="text-lg font-semibold text-center mb-2">🗺️ Select Route on Map</h3>

      <MapContainer
        center={[35.2271, -80.8431]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapClickHandler />
        <AutoFocusMap />
        {clicks.map((position, idx) => (
          <Marker key={idx} position={position} icon={markerIcon} />
        ))}
      </MapContainer>

      <div className="mt-3 text-center text-sm text-gray-700 space-y-2">
        {clicks[0] && (
          <div>
            <strong>📍 Start:</strong> {formatCoord(clicks[0])}
            <br />
            <em className="text-gray-500">{addresses.start || 'Loading...'}</em>
          </div>
        )}
        {clicks[1] && (
          <div>
            <strong>🏁 Destination:</strong> {formatCoord(clicks[1])}
            <br />
            <em className="text-gray-500">{addresses.dest || 'Loading...'}</em>
          </div>
        )}
        {!clicks[0] && <p>Click once to set start point.</p>}
        {clicks[0] && !clicks[1] && <p>Click again to set destination.</p>}
      </div>

      {distance && (
        <div className="mt-3 text-center text-green-700 font-medium">
          📏 <strong>Route Distance:</strong> {distance.toFixed(2)} km
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={resetPoints}
          disabled={!isLocked}
          className={`px-4 py-2 rounded text-white font-semibold transition ${
            isLocked
              ? 'bg-red-500 animate-pulse hover:bg-red-600'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          🔄 Reset Route
        </button>
      </div>
    </section>
  );
};

export default MapSelector;