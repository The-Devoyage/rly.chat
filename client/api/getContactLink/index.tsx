import { Address, ServiceResponse } from "@/types";
import apiClient from "..";

export const getContactLink = async (payload: { address: Address; publicKey: string }) => {
  try {
    const res = await apiClient.post<ServiceResponse<{ token: string }>>("/contact-link/encrypt", {
      address: payload.address,
      public_key: payload.publicKey,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
