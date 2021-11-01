import { UserProfileModel } from './UserProfile';
import { AsyncEntitySliceState } from '../../factories/create-async-entity-slice';
import { AsyncModelSliceState } from '../../factories/create-async-model-slice';
import { EntitySliceState } from '../../factories/create-entity-slice';
import { ModelSliceState } from '../../factories/create-model-slice';
import { AlertsSliceActions } from '../features/AlertDuck';
import { FollowersSliceActions } from '../features/FollowersDuck';
import { UserProfileSliceActions } from '../features/UserProfileDuck';

export type MenuModel = {
  open: boolean;
};

export type AlertModel = {
  id: string;
  open: boolean;
  message: string;
  severity: string;
};

type TestAppState = {
  Menu: ModelSliceState<MenuModel>;
  Alerts: EntitySliceState<AlertModel, AlertsSliceActions>;
  UserProfile: AsyncModelSliceState<UserProfileModel, Error, UserProfileSliceActions>
  Followers: AsyncEntitySliceState<UserProfileModel, Error, FollowersSliceActions>
};

export default TestAppState;
