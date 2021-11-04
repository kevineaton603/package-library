import { createSelector } from 'reselect';
import ModelState, { ModelStateType } from '../../models/model-state';
import { Action, MetaSliceSelectors, SetAction, SliceSetActions, SliceSelectors, SliceStateActions } from '../../types';
import createSliceAdapter from '../../adapters/create-slice-adapter';
import { getISOString } from '../../utils';
import { SetState } from 'zustand';
import { createStateActions } from '../../models/actions-state/ActionsState';

export type ModelSliceSelectors<
  TAppState extends object,
  TModel extends object,
  TSliceActions extends ModelSliceStateActions<TModel> = ModelSliceStateActions<TModel>,
> = SliceSelectors<TAppState, ModelStateType<TModel>, TSliceActions> & MetaSliceSelectors<TAppState> & {
  selectModel: (state: TAppState) => TModel;
};

export type ModelSliceSetActions<TAppState extends object, TModel extends object> = SliceSetActions<TAppState> & {
  set: SetAction<TAppState, [TModel]>;
  update: SetAction<TAppState, [TModel]>;
};

export type ModelSliceStateActions<TModel extends object> = SliceStateActions & {
  set: Action<[TModel]>;
  update: Action<[TModel]>;
};

export type ModelSliceState<TModel extends object, TSliceActions extends ModelSliceStateActions<TModel> = ModelSliceStateActions<TModel>> = ModelStateType<TModel> & {
  actions: TSliceActions
};

export type ModelSlice<
  TAppState extends object,
  TModel extends object,
  TSliceActions extends ModelSliceStateActions<TModel> = ModelSliceStateActions<TModel>,
> = {
  name: keyof TAppState;
  actions: ModelSliceSetActions<TAppState, TModel>;
  selectors: ModelSliceSelectors<TAppState, TModel, TSliceActions>;
  state: ModelStateType<TModel>;
};

export const createModelSliceState = <
  TAppState extends object,
  TModel extends object,
  TSliceStateActions extends ModelSliceStateActions<TModel> = ModelSliceStateActions<TModel>,
  TSliceSetActions extends ModelSliceSetActions<TAppState, TModel> = ModelSliceSetActions<TAppState, TModel>,
>(set: SetState<TAppState>, state: ModelStateType<TModel>, actions: TSliceSetActions): ModelSliceState<TModel, TSliceStateActions> => ({
    ...state,
    actions: createStateActions<TAppState, TSliceStateActions, TSliceSetActions>(set, actions),
  });

const createModelSlice = <
  TAppState extends object,
  TModel extends object,
  TSliceActions extends ModelSliceStateActions<TModel> = ModelSliceStateActions<TModel>,
>(options: {
    name: keyof TAppState;
    selectSliceState: (appState: TAppState) => ModelSliceState<TModel, TSliceActions>
    initialState?: Partial<ModelStateType<TModel>>
  }): ModelSlice<TAppState, TModel, TSliceActions> => {

  const initialState = ModelState.create(options?.initialState);

  const selectors = {
    selectSliceState: createSelector(options.selectSliceState, (model) => model),
    selectModel: createSelector(options.selectSliceState, (model) => model.model),
    selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
    selectActions: createSelector(options.selectSliceState, (model) => model.actions),
  };

  const sliceAdapter = createSliceAdapter<ModelSliceState<TModel>>();

  const modifyState = (state: ModelSliceState<TModel>, lastModified: string | null): ModelSliceState<TModel> => {
    return sliceAdapter.setLastModified(state, lastModified);
  };

  const actions: ModelSliceSetActions<TAppState, TModel> = {
    reset: (set) => () => set(state => ({
      ...state,
      [options.name]: {
        ...state[options.name],
        ...initialState, 
      }, 
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

