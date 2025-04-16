import {useMapEvents} from "react-leaflet";

const MapClickHandler = ({ setSelectedLocation }: { setSelectedLocation: any }) => {
    useMapEvents({
        click(e: { latlng: { lat: never; lng: never; }; }) {
            setSelectedLocation([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
};

export default MapClickHandler;