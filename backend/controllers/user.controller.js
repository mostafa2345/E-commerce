import Profile from "../models/profile.model.js";
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    log("Error in getProfile controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const createProfile = async (req, res) => {
  try {
    const { fullname, phone, location } = req.body;
    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });
    if (profile) {
      return res.status(404).json({ message: "Profile already exists" });
    }
    const newProfile = await Profile.create({
      userId,
      fullName: fullname,
      phone,
      addresses: [location],
    });
    res.status(200).json(newProfile);
  } catch (error) {
    log("Error in getProfile controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile.addresses);
  } catch (error) {
    log("Error in getAdresses controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const newAddress = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId, "addresses._id": addressId },
      { $set: { "addresses.$": newAddress } },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile.addresses);
  } catch (error) {
    log("Error in getAdresses controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
