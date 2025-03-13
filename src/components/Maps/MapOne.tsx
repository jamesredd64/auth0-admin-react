import { useEffect, useRef } from 'react';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/jsvectormap.css';
import '../../js/us-aea-en';// We'll create this file next

const MapOne = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = new jsVectorMap({
        selector: mapRef.current,
        map: 'us_aea_en',
        zoomOnScroll: true,
        zoomButtons: true,
      });

      return () => {
        map.destroy();
      };
    }
  }, []);

  return (
    <div
      ref={mapRef}
      className="h-[400px] w-full"
    ></div>
  );
};

export default MapOne;
