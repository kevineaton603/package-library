import { SetState } from 'zustand';
import { Action, SetAction } from '../..';
import createEntitySlice from '../../factories/create-entity-slice';
import { createEntitySliceState, EntitySliceState, EntitySliceStateActions } from '../../factories/create-entity-slice/CreateEntitySlice';
import TestAppState from '../models/TestAppState';
import { AlertModel } from '../models/AlertModel';

export type AlertsSliceActions = EntitySliceStateActions<AlertModel> & {
  closeAll: Action
};

export type AlertModelSliceState = EntitySliceState<AlertModel, AlertsSliceActions>;

const slice = createEntitySlice<TestAppState, AlertModel, AlertsSliceActions>({
  name: 'Alerts',
  selectSliceState: (appState) => appState.Alerts,
  selectId: 'id',
  sortComparer: (entityA, entityB) => {
    if (!entityA.id) {
      throw new Error('Missing required property: name');
    }
    if (!entityB.id) {
      throw new Error('Missing required property: name');
    }
    return entityA.id.localeCompare(entityA.id);
  },
});

const closeAll: SetAction<TestAppState> = (set) => () => set(state => {
  const sliceState = state.Alerts;
  const alerts = Object.values(sliceState.entities).map(alertModel => ({
    ...alertModel,
    open: false,
  }));
  slice.actions.upsertMany(set)(alerts);
}); 

const allActions = {
  ...slice.actions,
  closeAll,
};

const createAlertsSlice = (set: SetState<TestAppState>) => createEntitySliceState<TestAppState, AlertModel, AlertsSliceActions>(set, slice.state, allActions);

const AlertsDuck = {
  create: createAlertsSlice,
  name: slice.name,
  selectors: slice.selectors,
};

export default AlertsDuck;
