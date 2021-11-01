import { createSelector } from 'reselect';
import { SetState } from 'zustand';
import { Action, SetAction } from '../..';
import StatusEnum from '../../constants/StatusEnum';
import createAsyncEntitySlice, { AsyncEntitySliceState, AsyncEntitySliceStateActions } from '../../factories/create-async-entity-slice';
import { createAsyncEntitySliceState } from '../../factories/create-async-entity-slice/CreateAsyncEntitySlice';
import TestAppState from '../models/TestAppState';
import { Profiles, UserProfileModel, UserRoleEnum } from '../models/UserProfile';

const getAllUsers = () => new Promise<UserProfileModel[]>((resolve) => {
  resolve(Profiles);
});

export type FollowersSliceActions = AsyncEntitySliceStateActions<UserProfileModel> & {
  getAll: Action<[], Promise<void>>;
};

export type FollowersEntityState = AsyncEntitySliceState<UserProfileModel, Error, FollowersSliceActions>;

const slice = createAsyncEntitySlice<TestAppState, UserProfileModel, Error, FollowersSliceActions>({
  name: 'Followers',
  selectSliceState: (appState) => appState.Followers,
  selectId: 'username',
  sortComparer: (entityA, entityB) => {
    if (!entityA.username) {
      throw new Error('Missing required property: name');
    }
    if (!entityB.username) {
      throw new Error('Missing required property: name');
    }
    return entityA.username.localeCompare(entityA.username);
  },
});

const getAll: SetAction<TestAppState, [], Promise<void>> = (set) => async () => {
  slice.actions.setStatus(set)(StatusEnum.Requesting);
  slice.actions.setError(set)(null);
  try {
    const response = await getAllUsers(); 
    slice.actions.hydrateAll(set)(response);
    slice.actions.setStatus(set)(StatusEnum.Settled);
  } catch (error) {
    slice.actions.setStatus(set)(StatusEnum.Failed);
    slice.actions.setError(set)(error as Error);
  }
};

const allActions = {
  ...slice.actions,
  getAll,
};

const selectByRole = (userRole: UserRoleEnum) => createSelector(
  slice.selectors.selectAll,
  (entities) => entities.filter((entity) => entity.roles.find(role => role === userRole)),
);

const allSelectors = {
  ...slice.selectors,
  selectByRole: selectByRole,
};

const createFollowersSlice = (set: SetState<TestAppState>) => createAsyncEntitySliceState<TestAppState, UserProfileModel, Error, FollowersSliceActions>(set, slice.state, allActions);

const FollwersDuck = {
  create: createFollowersSlice,
  name: slice.name,
  selectors: allSelectors,
};

export default FollwersDuck;

