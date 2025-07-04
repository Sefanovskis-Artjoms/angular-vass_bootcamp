import { User } from './user';

export interface UsersViewModel {
  users: User[];
  isLoading: boolean;
  hasError: boolean;
}
