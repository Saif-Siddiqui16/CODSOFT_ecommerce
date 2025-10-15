import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/data/hook";
import {
  createCoupon,
  deleteCoupon,
  fetchCoupons,
} from "@/store/shop/discount-slice";

const CouponPage = () => {
  const dispatch = useAppDispatch();
  const { coupons, isLoading, error } = useAppSelector((state) => state.coupon);

  const [form, setForm] = useState({
    code: "",
    discountPercent: "",
    expiresAt: "",
  });

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code || !form.discountPercent || !form.expiresAt) return;

    await dispatch(
      createCoupon({
        code: form.code.trim(),
        discountPercent: Number(form.discountPercent),
        expiresAt: form.expiresAt,
      })
    );

    setForm({ code: "", discountPercent: "", expiresAt: "" });
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteCoupon(id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>

      <form
        onSubmit={handleAddCoupon}
        className="bg-white p-4 shadow rounded space-y-4 mb-10"
      >
        <div>
          <label className="block font-medium">Code</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Discount (%)</label>
          <input
            type="number"
            name="discountPercent"
            value={form.discountPercent}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            required
            min={1}
            max={100}
          />
        </div>

        <div>
          <label className="block font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiresAt"
            value={form.expiresAt}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? "Adding..." : "Add Coupon"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Existing Coupons</h2>
      {isLoading ? (
        <p>Loading coupons...</p>
      ) : coupons.length === 0 ? (
        <p>No coupons available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Discount</th>
                <th className="text-left p-3">Expiry</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="border-b">
                  <td className="p-3">{coupon.code}</td>
                  <td className="p-3">{coupon.discountPercent}%</td>
                  <td className="p-3">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default CouponPage;
