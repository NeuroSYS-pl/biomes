export interface CreateUserDTO {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
}

export interface UpdateUserDTO {
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
}
