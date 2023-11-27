export default interface CreateUserParams {
  position: string;
  username: string;
  password: string;
  email: string;
  roles: { name: string }[];
  firstName: string;
  lastName: string;
  patronymic: string;
  birthDate: string; // Format: "2023-11-25"
}
