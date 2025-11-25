export interface Customer {
  id: string;
  name: string;
  surname: string;
  phone: string;
  street: string;
  streetNumber: string;
  city: string;
  state: string;
  neighborhood: string;
  complement: string | null;
  active: boolean;
}
