import { AsyncModelSliceState } from '../factories/create-async-model-slice';
import { EntitySliceState } from '../factories/create-entity-slice/CreateEntitySlice';
import { ModelSliceState } from '../factories/create-model-slice/CreateModelSlice';
import { UserProfileModel, UserRoleEnum } from './models/UserProfile';

export type UserProfileEntityState = EntitySliceState<UserProfileModel>;

export type UserProfileModelState = ModelSliceState<UserProfileModel>;

export type UserProfileAsyncModelState = AsyncModelSliceState<UserProfileModel>;

export type TestAppState = {
  User: UserProfileModelState;
  Followers: UserProfileEntityState;
};

export const PremiumProfile = Object.freeze<UserProfileModelState>({
  model: {
    username: 'keaton@champlain.edu',
    url: 'https://github.com/kevineaton603',
    roles: [UserRoleEnum.Premium],
  },
  lastHydrated: null,
  lastModified: null,
  actions: {
    hydrate: () => {},
    reset: () => {},
    set: () => {},
    update: () => {},
  },
});

export const BasicProfile = Object.freeze<UserProfileModelState>({
  model: {
    username: 'gov.eaton@gmail.com',
    url: 'https://github.com/kevineaton603',
    roles: [UserRoleEnum.Basic],
  },
  lastHydrated: null,
  lastModified: null,
  actions: {
    hydrate: () => {},
    reset: () => {},
    set: () => {},
    update: () => {},
  },
});

export const AdminProfile = Object.freeze<UserProfileModelState>({
  model: {
    username: 'kevin.saco.eaton@gmail.com',
    url: 'https://github.com/kevineaton603',
    roles: [UserRoleEnum.Admin],
  },
  lastHydrated: null,
  lastModified: null,
  actions: {
    hydrate: () => {},
    reset: () => {},
    set: () => {},
    update: () => {},
  },
});
