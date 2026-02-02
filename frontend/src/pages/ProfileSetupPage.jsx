import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import LocationPicker from "../components/LocationPicker";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/zustand/userUserStore";

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState(null);
  const [isDefault, setIsDefault] = useState(true);
  const { addToProfile } = useUserStore();

  // Validate and move to next step
  const handleNext = () => {
    if (step === 1 && !fullName.trim()) {
      toast.error("Please enter your full name", {
        id: "full",
      });
      return;
    }
    if (step === 2) {
      if (!phone || !isValidPhoneNumber(phone)) {
        toast.error("Please enter a valid phone number", {
          id: "phone",
        });
        return;
      }
    }
    if (step === 3) {
      if (!location) {
        toast.error("Please select your location", {
          id: "loc",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Merge isDefault into location object
    const locationWithDefault = {
      ...location,
      isDefault: isDefault,
    };

    // Now includes isDefault
    addToProfile({
      fullname: fullName,
      phone: phone,
      location: locationWithDefault,
    });
    toast.success("Profile setup completed successfully!");
    // Add your submit logic here
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center text-sm text-gray-600">
        Step {step} of {totalSteps}
      </p>

      {/* Form fields */}
      <div className="mt-6">
        {step === 1 && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}
        {step === 2 && (
          <PhoneInput
            placeholder="Phone Number"
            value={phone}
            onChange={setPhone}
            defaultCountry="EG"
            className="w-full border border-gray-300 rounded-md p-3 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
          />
        )}
        {step === 3 && (
          <div>
            <p className="text-gray-700 mb-2">
              📍 Select your address on the map
            </p>
            <LocationPicker
              onLocationSelect={(coords) => {
                setLocation(coords);
              }}
            />
            {location && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-green-600 mb-3">
                  ✓ Location selected
                </p>

                {/* Display address details if available */}
                {location.city && (
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>🏙️ City: {location.city}</p>
                    <p>🌍 Country: {location.country}</p>
                    <p>🛣️ Street: {location.street}</p>
                  </div>
                )}

                {/* Default Address Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    Set as default address
                  </span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-400 transition"
        >
          Back
        </button>
        <button
          disabled={step === totalSteps}
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>

      {/* Submit button - only show on last step */}
      {step === totalSteps && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
