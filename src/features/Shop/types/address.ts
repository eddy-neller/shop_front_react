export interface ShopAddress {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  company?: string | null;
  address: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopAddressCreatePayload {
  name: string;
  firstname: string;
  lastname: string;
  company?: string | null;
  address: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

export type ShopAddressUpdatePayload = Partial<ShopAddressCreatePayload>;
