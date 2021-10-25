import { EntitySliceState } from '../factories/create-entity-slice/CreateEntitySlice';
import { ModelSliceState } from '../factories/create-model-slice/CreateModelSlice';

export enum UserRoleEnum {
  Basic,
  Premium,
  Admin,
}

export type UserProfileModel = {
  username: string;
  url: string;
  roles: UserRoleEnum[];
};

export type UserProfileEntityState = EntitySliceState<TestAppState, UserProfileModel>;

export type UserProfileModelState = ModelSliceState<TestAppState, UserProfileModel>;

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
    hydrate: () => (appState) => appState,
    reset: () => (appState) => appState,
    set: () => (appState) => appState,
    update: () => (appState) => appState,
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
    hydrate: () => (appState) => appState,
    reset: () => (appState) => appState,
    set: () => (appState) => appState,
    update: () => (appState) => appState,
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
    hydrate: () => (appState) => appState,
    reset: () => (appState) => appState,
    set: () => (appState) => appState,
    update: () => (appState) => appState,
  },
});