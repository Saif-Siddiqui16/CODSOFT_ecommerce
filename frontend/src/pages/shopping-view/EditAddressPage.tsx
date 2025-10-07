import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/data/hook";
import { editaAddress, fetchAllAddresses } from "@/store/shop/address-slice";

export interface AddressForm {
  address: string;
  city: string;
  pincode: string;
  phone: string;
}

const EditAddressPage: React.FC = () => {
  const { addressId } = useParams<{ addressId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<AddressForm>({
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (!addressId) return;

      const response: any = await dispatch(fetchAllAddresses());
      const existing = response.payload.find(
        (addr: any) => addr._id === addressId
      );

      if (existing) {
        setForm({
          address: existing.address,
          city: existing.city,
          pincode: existing.pincode,
          phone: existing.phone,
        });
      }
    };

    fetchAddress();
  }, [addressId, dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!addressId) return;

    try {
      await dispatch(editaAddress({ addressId, formData: form })).unwrap();
      // navigate back to profile page after success
      navigate("/account/addresses");
    } catch (err) {
      console.error("Failed to update address:", err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Address</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4 max-w-md"
      >
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <Input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street Address"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">City</label>
          <Input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Pincode</label>
          <Input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <Input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600"
        >
          Update Address
        </Button>
      </form>
    </div>
  );
};

export default EditAddressPage;
