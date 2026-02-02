import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  CreditCard,
  Wallet,
  Building2,
  ShoppingBag,
  Lock,
  CheckIcon,
  ChevronDownIcon,
} from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/zustand/useCartStore";
import { useUserStore } from "../stores/zustand/userUserStore";
import axiosInstance from "../lib/axios";
import { useCreateOrderMutation } from "../stores/api/orderApi";
import { useOrderStore } from "../stores/zustand/useOrderStore";

const CheckoutPage = () => {

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      paymentMethod: "stripe",
    },
    mode: "onSubmit",
  });

  const { profile } = useUserStore();
  const { cart, isCouponApplied, coupon, total, subtotal } = useCartStore();
  const[createOrder,{isLoading,isSuccess,isError}]=useCreateOrderMutation()
  
  const selectedPayment = watch("paymentMethod");
  useEffect(() => {
    if (profile) {
      const defaultAddress = profile.addresses?.find(
        (address) => address.isDefault
      );

      const nameParts = profile.fullName?.split() || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "error";
      reset({
        firstName: firstName,
        lastName: lastName,
        email: profile.email || "ffhhfhfahfhf",
        phone: profile.phone || "",
        address: defaultAddress?.fullAddress || "",
        city: defaultAddress?.city || "",
        state: defaultAddress?.state || "",
        zipCode: defaultAddress?.zipCode || "12345",
        country: defaultAddress?.country || "",
        paymentMethod: "stripe",
      });
    }
  }, [profile, reset]);
  const onCheckOutSubmit = async (data) => {
    const checkoutData = {
      shippingAddress: {
        street: data.address,
        city: data.city,
        country: data.country,
        zip: data.zipCode,
      },
      fullName: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      email: data.email,
      paymentMethod: data.paymentMethod,
    };
    if (isLoading) {
      return;
    }
    try {
     
      const handleStripePayment = async (orderId) => {
        try {
          const payload = {
            products: cart,
            couponCode: isCouponApplied && coupon ? coupon.code : null,
            orderId,
          };

          const res = await axiosInstance.post(
            "/payments/create-checkout-session",
            payload
          );

          const sessionUrl = res.data?.url;

          if (!sessionUrl) {
            throw new Error("No session URL received from server");
          }

          if (!sessionUrl.startsWith("https://checkout.stripe.com")) {
            throw new Error("Invalid Stripe session URL");
          }

          // Show loading message before redirect
          toast.loading("Redirecting to payment...", { duration: 1000 });

          // Small delay for better UX (let user see the loading message)
          setTimeout(() => {
            window.location.href = sessionUrl;
          }, 500);
        } catch (error) {
          console.error("Stripe payment error:", error);
          toast.error(
            error.response?.data?.message || "Failed to initialize payment"
          );
         // Re-enable button on error
        }
      };
      const orderPayload = {
        cart,
        coupon: coupon,
        isCouponApplied,
        checkoutData: checkoutData,
      };
      const orderRes = await createOrder(orderPayload).unwrap();
     
      console.log(orderRes);
      if (isError) {
        toast.error( "Failed to create order");
      
        return;
      }

      const orderId = orderRes;
      if (isSuccess && checkoutData.paymentMethod === "stripe") {
        await handleStripePayment(orderId);
      } else {
        return console.log("something wrong ", checkoutData.paymentMethod);
      }
      //create order we need order id in the pyament intent
    } catch (error) {
      console.log(error.message);
    }
  };

  // Debug: Log form errors
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("❌ Form validation errors:", errors);
    }
  }, [errors]);

  const savings = subtotal - total;
  const formattedSavings = savings.toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <motion.div
          className="mx-auto w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
                <ShoppingBag className="w-8 h-8" />
                Checkout
              </h1>
              <p className="mt-2 text-gray-600">Complete your purchase</p>
            </div>

            <form onSubmit={handleSubmit(onCheckOutSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Contact Info & Payment */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Information */}
                  {!profile ? (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-6 text-gray-900">
                        Contact Information
                      </h2>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block mb-2 text-sm font-medium text-gray-700"
                            >
                              First Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                              {...register("firstName")}
                            />
                            {errors.firstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.firstName.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block mb-2 text-sm font-medium text-gray-700"
                            >
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                              {...register("lastName")}
                            />
                            {errors.lastName && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.lastName.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            Phone
                          </label>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <div className="w-full">
                                <PhoneInput
                                  country={"eg"}
                                  value={value}
                                  onChange={(
                                    phone,
                                    country,
                                    e,
                                    formattedValue
                                  ) => {
                                    onChange(formattedValue || `+${phone}`);
                                  }}
                                  inputProps={{
                                    id: "phone",
                                    name: "phone",
                                    required: true,
                                    className:
                                      "w-full h-10 px-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg",
                                  }}
                                  containerClass="w-full"
                                  inputClass="w-full"
                                  buttonClass="border-gray-300 bg-gray-50 rounded-l-md"
                                  dropdownClass="z-50 border-gray-200 shadow-lg text-black"
                                  countryCodeEditable={false}
                                />
                                {errors.phone && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {errors.phone.message}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="address"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            Street Address
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            {...register("address")}
                          />
                          {errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.address.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label
                              htmlFor="city"
                              className="block mb-2 text-sm font-medium text-gray-700"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                              {...register("city")}
                            />
                            {errors.city && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="state"
                              className="block mb-2 text-sm font-medium text-gray-700"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                              {...register("state")}
                            />
                            {errors.state && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.state.message}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="zipCode"
                              className="block mb-2 text-sm font-medium text-gray-700"
                            >
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                              {...register("zipCode")}
                            />
                            {errors.zipCode && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.zipCode.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="country"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            {...register("country")}
                          />
                          {errors.country && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.country.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-6 text-gray-900">
                        Contact Information
                      </h2>
                      <div className="space-y-2 text-gray-700">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">Name:</span>
                          <span className="text-gray-800">
                            {profile.fullName || "Not provided"}
                          </span>
                        </p>
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">Email:</span>
                          <span className="text-gray-800">
                            {profile.email || "Not provided"}
                          </span>
                        </p>
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">Phone:</span>
                          <span className="text-gray-800">
                            {profile.phone || "Not provided"}
                          </span>
                        </p>
                        {profile.addresses && (
                          <div>
                            <span className="font-medium">Address:</span>
                            {profile.addresses.find((add) => add.isDefault) ? (
                              <div className="flex flex-col md:flex-row gap-2">
                                <span className="text-gray-800">
                                  {
                                    profile.addresses.find(
                                      (add) => add.isDefault
                                    ).fullAddress
                                  }
                                </span>
                                <span className="mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded w-fit">
                                  Default
                                </span>
                              </div>
                            ) : (
                              <span>Not provided</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">
                      Payment Method
                    </h2>

                    <div className="space-y-3 mb-6">
                      {/* Credit Card */}
                      <button
                        type="button"
                        onClick={() => setValue("paymentMethod", "stripe")}
                        className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition ${
                          selectedPayment === "card"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === "stripe"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "stripe" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <CreditCard
                          className={`w-5 h-5 ${
                            selectedPayment === "card"
                              ? "text-blue-500"
                              : "text-gray-600"
                          }`}
                        />
                        <span className="font-medium text-gray-900">
                          Credit / Debit Card
                        </span>
                      </button>

                      {/* PayPal */}
                      <button
                        type="button"
                        onClick={() => setValue("paymentMethod", "paypal")}
                        className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition ${
                          selectedPayment === "paypal"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === "paypal"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "paypal" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <Wallet
                          className={`w-5 h-5 ${
                            selectedPayment === "paypal"
                              ? "text-blue-500"
                              : "text-gray-600"
                          }`}
                        />
                        <span className="font-medium text-gray-900">
                          PayPal
                        </span>
                      </button>

                      {/* Bank Transfer */}
                      <button
                        type="button"
                        onClick={() => setValue("paymentMethod", "bank")}
                        className={`w-full flex items-center gap-3 p-4 border-2 rounded-lg transition ${
                          selectedPayment === "bank"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === "bank"
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedPayment === "bank" && (
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <Building2
                          className={`w-5 h-5 ${
                            selectedPayment === "bank"
                              ? "text-blue-500"
                              : "text-gray-600"
                          }`}
                        />
                        <span className="font-medium text-gray-900">
                          Bank Transfer
                        </span>
                      </button>
                    </div>

                    {/* Card Details (shown only when card is selected) */}
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">
                      Order Summary
                    </h2>

                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item._id} className="flex gap-4">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            {item.quantity > 1 && (
                              <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                {item.quantity}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Original price</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {savings > 0 && (
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-300">
                            Savings
                          </dt>
                          <dd className="text-base font-medium text-emerald-400">
                            -${formattedSavings}
                          </dd>
                        </dl>
                      )}
                      {coupon && isCouponApplied && (
                        <dl className="flex justify-between text-sm text-gray-600">
                          <dt className="text-base font-normal text-gray-300">
                            Coupon ({coupon.code})
                          </dt>
                          <dd className="text-base font-medium text-emerald-400">
                            -{coupon.discountPercentage}%
                          </dd>
                        </dl>
                      )}
                      <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || cart.length === 0}
                      className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Lock className="w-5 h-5" />
                      {isLoading ? "Processing..." : "Complete Purchase"}
                    </button>

                    <p className="mt-4 text-center text-sm text-gray-500">
                      Your payment information is secure
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
const checkoutSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(
      (val) => {
        try {
          const phoneNumber = parsePhoneNumberFromString(val);
          return phoneNumber?.isValid();
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid phone number" }
    )
    .optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Valid email is required").optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["stripe", "paypal", "bank"]),
});

export default CheckoutPage;
