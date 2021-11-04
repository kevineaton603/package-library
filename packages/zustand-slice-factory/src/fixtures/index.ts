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

export const PremiumProfileModelState = Object.freeze<UserProfileModelState>({
  model: {
    username: 'keaton@champlain.edu',
    url: 'https://github.com/kevineaton603',
    roles: [UserRoleEnum.Premium],
  },
  lastModified: null,
  actions: {
    reset: () => {},
    set: () => {},
    update: () => {},
  },
});

export const BasicProfileModelState = Object.freeze<UserProfileModelState>({
  model: {
    username: 'gov.eaton@gmail.com',
    url: 'https://github.com/kevineaton603',
    roles: [UserRoleEnum.Basic],
  },
  lastModified: null,
  actions: {
    reset: () => {},
    set: () => {},
    update: () => {},
  },
});

export const AdminProfileModelState = Object.freeze<UserProfileModelState>({
  model: {
    username: 'kevin.saco.eaton@gmail.com',
    url: 'https://github.com/kevineaton603',
    roles: [UserRoleEnum.Admin],
  },
  lastModified: null,
  actions: {
    reset: () => {},
    set: () => {},
    update: () => {},
  },
});
