import { UserProfileModel } from './UserProfile';
import { AsyncEntitySliceState } from '../../factories/create-async-entity-slice';
import { AsyncModelSliceState } from '../../factories/create-async-model-slice';
import { EntitySliceState } from '../../factories/create-entity-slice';
import { ModelSliceState } from '../../factories/create-model-slice';
import { AlertsSliceActions } from '../features/AlertDuck';
import { FollowersSliceActions } from '../features/FollowersDuck';
import { UserProfileSliceActions } from '../features/UserProfileDuck';
import { AlertModel } from './AlertModel';
import { MenuModel } from './MenuModel';

type TestAppState = {
  Menu: ModelSliceState<MenuModel>;
  Alerts: EntitySliceState<AlertModel, AlertsSliceActions>;
  UserProfile: AsyncModelSliceState<UserProfileModel, Error, UserProfileSliceActions>
  Followers: AsyncEntitySliceState<UserProfileModel, Error, FollowersSliceActions>
};

export default TestAppState;
