import { SVGProps } from "react";

export type SimUuid = string;
export type Address = string;
export type PublicKey = string;
export type SecretKey = string;
export type Identifier = string;

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Contact {
  uuid: SimUuid;
  address: Address;
  publicKey: PublicKey;
  name?: string;
}

export interface Sim {
  uuid: SimUuid;
  identifier: Identifier;
  profile: {
    secretKey: SecretKey;
    publicKey: PublicKey;
    address: Address;
  };
}

export interface Message {
  to: SimUuid;
  from: SimUuid;
  text: string;
}

export interface EncryptedMessage {
  conversation: SimUuid;
  encryptedMessage: string;
  nonce: string;
}

export interface ServiceResponse<T extends Record<string, unknown>> {
  success: boolean;
  data?: T;
}
