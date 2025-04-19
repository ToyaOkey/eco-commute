import { useState } from 'react';
import MapSelector from './MapSelector';
import CommuteForm from './CommuteForm';

const CommutePage = () => {
  const [startLatLng, setStartLatLng] = useState<[number, number] | null>(null);
  const [endLatLng, setEndLatLng] = useState<[number, number] | null>(null);

  return (
    <div>
      <MapSelector
        onSelect={(start, dest) => {
          setStartLatLng(start);
          setEndLatLng(dest);
        }}
      />
      <CommuteForm
        startLocation={startLatLng}
        destinationLocation={endLatLng}
      />
    </div>
  );
};

export default CommutePage;