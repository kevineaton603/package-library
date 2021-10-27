import { createSelector } from 'reselect';
import ModelState, { ModelStateType } from '../../models/model-state';
import { Action, MetaSliceSelectors, SetAction, SliceSetActions, SliceSelectors, SliceStateActions } from '../../types';
import createSliceAdapter from '../../adapters/create-slice-adapter';
import { getISOString } from '../../utils';

export type ModelSliceSelectors<TAppState extends object, TModel extends object> = SliceSelectors<TAppState, ModelStateType<TModel>, ModelSliceStateActions<TModel>> & MetaSliceSelectors<TAppState> & {
  selectModel: (state: TAppState) => TModel;
};

export type ModelSliceSetActions<TAppState extends object, TModel extends object> = SliceSetActions<TAppState> & {
  hydrate: SetAction<TAppState, [TModel]>;
  set: SetAction<TAppState, [TModel]>;
  update: SetAction<TAppState, [TModel]>;
};

export type ModelSliceStateActions<TModel extends object> = SliceStateActions & {
  hydrate: Action<[TModel]>;
  set: Action<[TModel]>;
  update: Action<[TModel]>;
};

export type ModelSliceState<TModel extends object, TSliceActions extends ModelSliceStateActions<TModel> = ModelSliceStateActions<TModel>> = ModelStateType<TModel> & {
  actions: TSliceActions
};

export type ModelSlice<TAppState extends object, TModel extends object> = {
  name: keyof TAppState;
  actions: ModelSliceSetActions<TAppState, TModel>;
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

  const sliceAdapter = createSliceAdapter<ModelSliceState<TModel>>();

  const modifyState = (state: ModelSliceState<TModel>, lastModified: string | null): ModelSliceState<TModel> => {
    return sliceAdapter.setLastModified(state, lastModified);
  };

  const hydrateState = (state: ModelSliceState<TModel>, lastHydrated: string | null): ModelSliceState<TModel> => {
    return sliceAdapter.setLastHydrated(sliceAdapter.setLastModified(state, null), lastHydrated);
  };

  const actions: ModelSliceSetActions<TAppState, TModel> = {
    reset: (set) => () => set(state => ({
      ...state,
      [options.name]: {
        ...state[options.name],
        ...initialState, 
      }, 
    })),
    hydrate: (set) => (model) => set(state => ({
      ...state,
      [options.name]: hydrateState({
        ...state[options.name] as unknown as ModelSliceState<TModel>,
        model: model, 
      }, getISOString()), 
    })),
    update: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState({
        ...state[options.name] as unknown as ModelSliceState<TModel>,
        model: model, 
      }, getISOString()), 
    })),
    set: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState({
        ...state[options.name] as unknown as ModelSliceState<TModel>,
        model: model, 
      }, getISOString()), 
    })),
  };

  return {
    name: options.name,
    actions: actions,
    selectors: selectors,
    state: initialState,
  };
};

export default createModelSlice;

