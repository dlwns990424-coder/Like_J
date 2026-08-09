import { useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

export default function GoogleMap() {
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);

  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const defaultCenter = {
    lat: 35.6762,
    lng: 139.6503,
  };

  const searchPlace = async () => {
    if (!keyword.trim()) return;

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location",
        },
        body: JSON.stringify({
          textQuery: keyword,
          languageCode: "ko",
        }),
      },
    );

    const data = await response.json();

    if (!data.places?.length) {
      setPlaces([]);
      setSelectedPlace(null);
      setSelectedPlaceId(null);
      return;
    }

    setPlaces(data.places);

    const firstPlace = data.places[0];

    setSelectedPlace(firstPlace);
    setSelectedPlaceId(firstPlace.id);
  };

  const selectPlace = (place) => {
    setSelectedPlace(place);
    setSelectedPlaceId(place.id);
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div>
        <div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="장소를 검색하세요"
          />

          <button onClick={searchPlace}>검색</button>
        </div>

        <div style={{ width: "100%", height: "400px" }}>
          <Map
            center={
              selectedPlace
                ? {
                    lat: selectedPlace.location.latitude,
                    lng: selectedPlace.location.longitude,
                  }
                : defaultCenter
            }
            zoom={selectedPlace ? 15 : 11}
            mapId="DEMO_MAP_ID"
          >
            {places.map((place, index) => {
              const isSelected = selectedPlaceId === place.id;

              return (
                <AdvancedMarker
                  key={place.id}
                  position={{
                    lat: place.location.latitude,
                    lng: place.location.longitude,
                  }}
                  onClick={() => selectPlace(place)}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: isSelected ? "#000" : "#fff",
                      color: isSelected ? "#fff" : "#000",
                      border: "2px solid #000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {index + 1}
                  </div>
                </AdvancedMarker>
              );
            })}
          </Map>
        </div>

        <div>
          {places.map((place, index) => {
            const isSelected = selectedPlaceId === place.id;

            return (
              <button
                key={place.id}
                onClick={() => selectPlace(place)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px",
                  backgroundColor: isSelected ? "#eee" : "#fff",
                  border: isSelected ? "2px solid #000" : "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                <strong>
                  {index + 1}. {place.displayName.text}
                </strong>

                <p>{place.formattedAddress}</p>
              </button>
            );
          })}
        </div>
      </div>
    </APIProvider>
  );
}
