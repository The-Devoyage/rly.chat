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
    contacts: Contact[];
  };
}
