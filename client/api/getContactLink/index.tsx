import { Address, ServiceResponse } from "@/types";
import apiClient from "..";

export const getContactLink = async (payload: {
  uuid: string;
  address: Address;
  publicKey: string;
  identifier: string;
}) => {
  try {
    const res = await apiClient.post<ServiceResponse<{ token: string }>>("/contact-link/encrypt", {
      uuid: payload.uuid,
      address: payload.address,
      public_key: payload.publicKey,
      identifier: payload.identifier,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
