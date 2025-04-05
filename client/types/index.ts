import Dexie, { EntityTable } from "dexie";
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
  simUuid: SimUuid;
  address: Address;
  publicKey: PublicKey;
  identifier?: string;
}

export interface EncryptedSim {
  uuid: SimUuid;
  identifier: Identifier;
  profile: {
    encryptedData: string;
    nonce: string;
  };
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

// Stored in indexed db
export interface EncryptedMessage {
  conversation: SimUuid;
  encryptedData: string; // JSONSTRING<Message>
  nonce: string;
  sender: SimUuid;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
}

// Sent over the socket
export interface SerializedMessage {
  conversation: SimUuid;
  address: Address;
  encryptedMessage: Pick<EncryptedMessage, "encryptedData" | "nonce" | "sender">;
}

export interface EncryptedContact {
  id: number;
  simUuid: SimUuid;
  encryptedData: string;
  nonce: string;
}

export type RlyDatabase = Dexie & {
  contacts: EntityTable<EncryptedContact, "id">;
  message: EntityTable<EncryptedMessage, "conversation">;
};
