import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {useState} from "react";
import MapClickHandler from "./MapClickHandler.tsx";
import * as React from "react";


type CommuteMapProps = {
    center: [number, number];
};

const Map: React.FC<CommuteMapProps> = () => {
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
    const center = [35.2271, -80.8431];
    const path = [
        [35.2271, -80.8431],
        [35.2400, -80.8500]
    ];

    return (
        <div className="mt-10">
            <MapContainer center ={center} zoom={13} className="h-64 w-full rounded-lg shadow">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={center} />
                <Polyline positions={path} pathOptions={{ color: 'green' }} />
                <MapClickHandler setSelectedLocation={setSelectedLocation} />
                {selectedLocation && <Marker position={selectedLocation} />}
            </MapContainer>
            {selectedLocation && (
                <p className="text-sm text-green-600 dark:text-green-300 mt-2 text-center">
                    📍 Selected Location: {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
                </p>
            )}
        </div>
    );
};

export default Map;