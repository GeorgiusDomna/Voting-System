export default interface IUser {
  position: string;
  username: string;
  password: string;
  email: string;
  roles: { name: string }[];
  firstName: string;
  lastName: string;
  patronymic: string;
  birthDate: string;
}
