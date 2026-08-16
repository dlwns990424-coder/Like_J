import { APIProvider } from "@vis.gl/react-google-maps";
import Router from "./routes/Router";

export default function App() {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Router />
    </APIProvider>
  );
}
