import { MapPin, Edit } from "lucide-react";
import { motion } from "framer-motion";

const DefaultAddress = ({ address, onEdit }) => {
  if (!address) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 text-center">
        <p className="text-gray-400">No default address set</p>
      </div>
    );
  }

  const { fullName, street, city, state, country, postalCode, phone } = address;

  return (
    <motion.div
      className="relative rounded-lg border border-emerald-500/30 bg-gray-800 p-6 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute -top-3 right-4 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
        Default
      </div>

      <div className="flex items-start">
        <div className="mr-4 mt-1 rounded-full bg-emerald-500/10 p-2 text-emerald-400">
          <MapPin className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Shipping Address
            </h3>
            <button
              onClick={onEdit}
              className="flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </button>
          </div>

          <div className="mt-3 space-y-1 text-sm text-gray-300">
            <p className="font-medium text-white">{fullName}</p>
            <p>{street}</p>
            <p>{`${city}, ${state} ${postalCode}`}</p>
            <p>{country}</p>
            <p className="pt-2 text-emerald-400">{phone}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DefaultAddress;
