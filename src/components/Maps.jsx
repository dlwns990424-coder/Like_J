import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function GoogleMap() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div style={{ width: "100%", height: "500px" }}>
        <Map
          defaultCenter={{
            lat: 35.6762,
            lng: 139.6503,
          }}
          defaultZoom={11}
        />
      </div>
    </APIProvider>
  );
}
