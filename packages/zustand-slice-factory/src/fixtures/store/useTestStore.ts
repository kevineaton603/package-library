import create from 'zustand';
import createVanilla from 'zustand';
import AlertsDuck from '../features/AlertDuck';
import FollwersDuck from '../features/FollowersDuck';
import MenuDuck from '../features/MenuDuck';
import UserProfileDuck from '../features/UserProfileDuck';
import TestAppState from '../models/TestAppState';

export const useTestVanillaStore = createVanilla<TestAppState>((set) => ({
  Alerts: AlertsDuck.create(set),
  Followers: FollwersDuck.create(set),
  Menu: MenuDuck.create(set),
  UserProfile: UserProfileDuck.create(set),
}));

const useTestStore = create<TestAppState>((set) => ({
  Alerts: AlertsDuck.create(set),
  Followers: FollwersDuck.create(set),
  Menu: MenuDuck.create(set),
  UserProfile: UserProfileDuck.create(set),
}));

export default useTestStore;

