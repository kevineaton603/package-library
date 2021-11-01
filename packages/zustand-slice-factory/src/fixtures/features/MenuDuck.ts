import TestAppState from '../models/TestAppState';
import { MenuModel } from '../models/MenuModel';
import createModelSlice from '../../factories/create-model-slice';
import { createModelSliceState } from '../../factories/create-model-slice/CreateModelSlice';
import { SetState } from 'zustand';

const slice = createModelSlice<TestAppState, MenuModel>({
  name: 'Menu',
  selectSliceState: (appState) => appState.Menu,
  initialState: {
    model: {
      open: false,
    },
  },
});

const createMenuSlice = (set: SetState<TestAppState>) => createModelSliceState(set, slice.state, slice.actions);

const MenuDuck = {
  create: createMenuSlice,
  name: slice.name,
  selectors: slice.selectors,
};

export default MenuDuck;
