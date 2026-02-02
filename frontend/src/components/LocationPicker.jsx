import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import { Crosshair } from "lucide-react";

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      const addressData = {
        lat,
        lng,
        city:
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "Unknown",
        country: data.address.country || "Unknown",
        street: data.address.road || data.address.street || "Unknown",
        state: data.address.state || "",
        fullAddress: data.display_name,
      };

      return addressData;
    } catch (error) {
      console.error("Error fetching address:", error);
      return {
        lat,
        lng,
        city: "Unknown",
        country: "Unknown",
        street: "Unknown",
        fullAddress: "Address not available",
      };
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Handle map clicks
  function LocationMarker() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        // Get address and pass to parent
        const addressData = await getAddressFromCoords(lat, lng);
        onLocationSelect(addressData);
      },
    });

    return position ? <Marker position={position} icon={markerIcon} /> : null;
  }

  // Component to handle centering map
  function CenterMap({ center }) {
    const map = useMap();
    if (center) {
      map.setView(center, 13);
    }
    return null;
  }

  // Get user's current location
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      const button = document.querySelector("[data-location-btn]");
      if (button) button.disabled = true;

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const location = [lat, lng];
          setUserLocation(location);
          setPosition(location);

          // Get address and pass to parent
          const addressData = await getAddressFromCoords(lat, lng);
          onLocationSelect(addressData);

          if (button) button.disabled = false;
        },
        (error) => {
          if (button) button.disabled = false;

       

          console.error("Geolocation error:", error);
          
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      alert(
        "Geolocation is not supported by your browser. Please click on the map to set your location."
      );
    }
  };

  return (
    <div className="relative">
      <MapContainer
        center={[26.8206, 30.8025]}
        zoom={6}
        style={{ height: "400px", width: "100%" }}
        className="rounded-md border"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <LocationMarker />
        <CenterMap center={userLocation} />
      </MapContainer>

      {/* Get My Location Button */}
      <button
        data-location-btn
        onClick={getUserLocation}
        className="absolute bottom-6 right-4 z-[1000] bg-white hover:bg-gray-50 p-3 rounded-lg shadow-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Get my location"
      >
        <Crosshair className="w-5 h-5 text-gray-700" />
      </button>

      {/* Helper text */}
      <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-md shadow-md text-sm text-gray-600">
        💡 Click on the map to set location
      </div>

      {/* Loading indicator */}
      {isLoadingAddress && (
        <div className="absolute bottom-6 left-4 z-[1000] bg-white px-3 py-2 rounded-md shadow-md text-sm text-gray-600">
          📍 Getting address...
        </div>
      )}
    </div>
  );
}

export default LocationPicker;
