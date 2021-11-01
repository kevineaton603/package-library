import { SetState } from 'zustand';
import { Action, SetAction } from '../..';
import StatusEnum from '../../constants/StatusEnum';
import createAsyncModelSlice from '../../factories/create-async-model-slice';
import { AsyncModelSliceState, AsyncModelSliceStateActions, createAsyncModelSliceState } from '../../factories/create-async-model-slice/CreateAsyncModelSlice';
import TestAppState from '../models/TestAppState';
import { Profiles, UserProfileModel } from '../models/UserProfile';

const getUser = (id: string) => new Promise<UserProfileModel>((resolve, reject) => {
  const userProfile = Profiles.find((profile) => profile.username === id);
  if (userProfile){
    resolve(userProfile);
  } else {
    reject(new Error('Failed to Find User'));
  }
});

export type UserProfileSliceActions = AsyncModelSliceStateActions<UserProfileModel> & {
  get: Action<[string], Promise<void>>;
};

export type UserProfileModelState = AsyncModelSliceState<UserProfileModel, Error, UserProfileSliceActions>;

const slice = createAsyncModelSlice<TestAppState, UserProfileModel, Error, UserProfileSliceActions>({
  name: 'UserProfile',
  selectSliceState: (appState) => appState.UserProfile,
});

const get: SetAction<TestAppState, [string], Promise<void>> = (set) => async (id) => {
  slice.actions.setStatus(set)(StatusEnum.Requesting);
  slice.actions.setError(set)(null);
  try {
    const response = await getUser(id); 
    slice.actions.hydrate(set)(response);
    slice.actions.setStatus(set)(StatusEnum.Settled);
  } catch (error) {
    slice.actions.setStatus(set)(StatusEnum.Failed);
    slice.actions.setError(set)(error as Error);
  }
};

const allActions = {
  ...slice.actions,
  get,
};

const createUserProfileSlice = (set: SetState<TestAppState>) => createAsyncModelSliceState<TestAppState, UserProfileModel, Error, UserProfileSliceActions>(set, slice.state, allActions);

const UserProfileDuck = {
  create: createUserProfileSlice,
  name: slice.name,
  selectors: slice.selectors,
};

export default UserProfileDuck;
