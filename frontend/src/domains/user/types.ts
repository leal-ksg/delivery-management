enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  active: boolean;
  role: UserRole;
};

export type CreateUserDTO = Omit<User, "id">;


