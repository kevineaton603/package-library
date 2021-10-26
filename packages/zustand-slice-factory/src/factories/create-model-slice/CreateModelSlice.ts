import { createSelector } from 'reselect';
import { SetState } from 'zustand';
import ModelState, { ModelStateType } from '../../models/model-state';
import { ModelSliceActions, ModelSliceSelectors, ModelSliceStateActions } from '../../types';

export type ModelSliceState<TModel extends object, TSliceActions extends ModelSliceStateActions<TModel> = ModelSliceStateActions<TModel>> = ModelStateType<TModel> & {
  actions: TSliceActions
};

export type ModelSlice<TAppState extends object, TModel extends object> = {
  name: keyof TAppState;
  actions: ModelSliceActions<TAppState, TModel>;
  selectors: ModelSliceSelectors<TAppState, TModel>;
  state: ModelStateType<TModel>;
};

const createModelSlice = <TAppState extends object, TModel extends object>(options: {
  name: keyof TAppState;
  selectSliceState: (appState: TAppState) => ModelSliceState<TModel>
  initialState?: Partial<ModelStateType<TModel>>
}): ModelSlice<TAppState, TModel> => {

  const initialState = ModelState.create(options?.initialState);

  const selectors = {
    selectSliceState: createSelector(options.selectSliceState, (model) => model),
    selectModel: createSelector(options.selectSliceState, (model) => model.model),
    selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
    selectLastHydrated: createSelector(options.selectSliceState, (model) => model.lastHydrated),
    selectActions: createSelector(options.selectSliceState, (model) => model.actions),
  };

  const actions: ModelSliceActions<TAppState, TModel> = {
    reset: (set) => () => set(state => ({
      ...state,
      [options.name]: {
        ...state[options.name],
        ...initialState, 
      }, 
    })),
    hydrate: (set) => (model) => set(state => ({
      ...state,
      [options.name]: {
        ...state[options.name],
        model: model, 
      }, 
    })),
    update: (set) => (model) => set(state => ({
      ...state,
      [options.name]: {
        ...state[options.name],
        model: model, 
      }, 
    })),
    set: (set) => (model) => set(state => ({
      ...state,
      [options.name]: {
        ...state[options.name],
        model: model, 
      }, 
    })),
  };

  return {
    name: options.name,
    actions: actions,
    selectors: selectors,
    state: initialState,
  };
};

export const createActionsState = <
  TAppState extends object,
  TModel extends object,
  TSliceStateActions extends ModelSliceStateActions<TModel> = ModelSliceStateActions<TModel>,
  TModelSliceActions extends ModelSliceActions<TAppState, TModel> = ModelSliceActions<TAppState, TModel>,
>(set: SetState<TAppState>, actions: TModelSliceActions): TSliceStateActions => {
  const entries = Object.entries(actions);
  const newActions = entries.reduce((acc, [key, entry]) => ({
    ...acc,
    [key]: entry(set),
  }), {} as TSliceStateActions);
  return newActions;
};

export default createModelSlice;

