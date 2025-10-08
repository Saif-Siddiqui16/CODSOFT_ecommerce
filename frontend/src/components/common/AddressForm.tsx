import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Address } from "@/lib/types";

interface Props {
  onSubmit: (address: Address) => void;
  initialData?: Address;
}

const AddressForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState<Address>({
    _id: initialData?._id || "",
    userId: initialData?.userId || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    pincode: initialData?.pincode || "",
    phone: initialData?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border p-4 rounded bg-white"
    >
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="input input-bordered w-full"
      />
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        className="input input-bordered w-full"
      />
      <input
        name="pincode"
        value={form.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        className="input input-bordered w-full"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="input input-bordered w-full"
      />
      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
        Save Address
      </Button>
    </form>
  );
};

export default AddressForm;
