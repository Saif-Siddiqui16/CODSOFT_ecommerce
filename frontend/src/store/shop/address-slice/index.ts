import { AddressForm } from "@/pages/shopping-view/EditAddressPage";
import { API_BASE_URL } from "@/store/auth-slice";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData: AddressForm) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/shop/address`,
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/api/shop/address`, {
      withCredentials: true,
    });

    return response.data;
  }
);

export interface EditAddressPayload {
  addressId: string;
  formData: {
    address: string;
    city: string;
    pincode: string;
    phone: string;
  };
}

export interface AddressResponse {
  _id: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
}

export const editaAddress = createAsyncThunk<
  AddressResponse,
  EditAddressPayload
>("addresses/editAddress", async ({ addressId, formData }) => {
  const response = await axios.put<AddressResponse>(
    `${API_BASE_URL}/api/shop/address/${addressId}`,
    formData,
    { withCredentials: true }
  );
  return response.data;
});
export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async (addressId: string) => {
    console.log(addressId);
    const response = await axios.delete(
      `${API_BASE_URL}/api/shop/address/${addressId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
