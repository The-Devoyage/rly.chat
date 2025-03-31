import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Contact {
  name?: string;
  address: string;
}

export interface Sim {
  identifier: string;
  profile: {
    publicKey: string;
    secretKey: string;
    address: string;
    contacts: Contact[];
  };
}

export type Address = string;

export interface Message {
  sender: Address;
  receiver: Address;
  text: string;
  read: boolean;
}

export interface ServiceResponse<T extends Record<string, unknown>> {
  success: boolean;
  data?: T;
}
