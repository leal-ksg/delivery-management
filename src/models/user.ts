import { Role } from "../../generated/prisma";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  active: boolean;
  role: Role;
}
