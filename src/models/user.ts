enum Role {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  active: boolean;
  role: Role;
}
