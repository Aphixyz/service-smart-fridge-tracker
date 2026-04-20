export interface CreateUserRegisterInput {
  name: string;
  username: string;
  password: string;
}

export interface UserRegister {
  id: number;
  name: string;
  username: string;
  password: string;
}
