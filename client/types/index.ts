import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Contact {
  name?: string;
  address: string;
  publicKey: string;
}

export interface Sim {
  identifier: string;
  profile: {
    publicKey: string;
    secretKey: string;
    address: string;
  };
}

export type Address = string;

export interface Message {
  sender: Address;
  receiver: Address;
  text: string;
}

export interface ServiceResponse<T extends Record<string, unknown>> {
  success: boolean;
  data?: T;
}

