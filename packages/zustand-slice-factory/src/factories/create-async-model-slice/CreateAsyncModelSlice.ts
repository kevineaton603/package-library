import { createSelector } from 'reselect';
import createSliceAdapter from '../../adapters/create-slice-adapter';
import AsyncModelState, { AsyncModelStateType } from '../../models/async-model-state';
import { Action, AsyncMetaSliceSelectors, AsyncSliceStateActions, AsyncSliceSetActions, SetAction, SliceSelectors } from '../../types';
import { getISOString } from '../../utils';

export type AsyncModelSliceSelectors<
  TAppState extends object, 
  TModel extends object,
  TError extends Error = Error,
  TSliceStateActions extends AsyncModelSliceStateActions<TModel, TError> = AsyncModelSliceStateActions<TModel, TError>,
> = SliceSelectors<TAppState, AsyncModelStateType<TModel, TError>, TSliceStateActions> & AsyncMetaSliceSelectors<TAppState, TError> & {
  selectModel: (state: TAppState) => TModel;
};

export type AsyncModelSliceSetActions<TAppState extends object, TModel extends object, TError extends Error = Error> = 
  AsyncSliceSetActions<TAppState, TError> & {
    hydrate: SetAction<TAppState, [TModel]>;
    set: SetAction<TAppState, [TModel]>;
    update: SetAction<TAppState, [TModel]>;
  };

export type AsyncModelSliceStateActions<TModel extends object, TError extends Error = Error> =
  AsyncSliceStateActions<TError> & {
    hydrate: Action<[TModel]>;
    set: Action<[TModel]>;
    update: Action<[TModel]>;
  };

export type AsyncModelSliceState<
  TModel extends object,
  TError extends Error = Error,
  TSliceActions extends AsyncModelSliceStateActions<TModel, TError> = AsyncModelSliceStateActions<TModel, TError>,
> = AsyncModelStateType<TModel, TError> & {
  actions: TSliceActions
};

export type AsyncModelSlice<TAppState extends object, TModel extends object, TError extends Error = Error, TSliceSetActions extends AsyncModelSliceStateActions<TModel, TError> = AsyncModelSliceStateActions<TModel, TError>> = {
  name: keyof TAppState;
  actions: AsyncModelSliceSetActions<TAppState, TModel, TError>;
  selectors: AsyncModelSliceSelectors<TAppState, TModel, TError, TSliceSetActions>;
  state: AsyncModelStateType<TModel, TError>;
};

const createAsyncModelSlice = <TAppState extends object, TModel extends object, TError extends Error = Error, TSliceStateActions extends AsyncModelSliceStateActions<TModel, TError> = AsyncModelSliceStateActions<TModel, TError>>(options: {
  name: keyof TAppState;
  selectSliceState: (appState: TAppState) => AsyncModelSliceState<TModel, TError, TSliceStateActions>
  initialState?: Partial<AsyncModelStateType<TModel, TError>>
}): AsyncModelSlice<TAppState, TModel, TError, TSliceStateActions> => {
  const initialState = AsyncModelState.create(options.initialState);

  const selectors: AsyncModelSliceSelectors<TAppState, TModel, TError, TSliceStateActions> = {
    selectActions: createSelector(options.selectSliceState, (model) => model.actions),
    selectSliceState: createSelector(options.selectSliceState, (model) => model),
    selectModel: createSelector(options.selectSliceState, (model) => model.model),
    selectStatus: createSelector(options.selectSliceState, (model) => model.status),
    selectError: createSelector(options.selectSliceState, (model) => model.error),
    selectLastHydrated: createSelector(options.selectSliceState, (model) => model.lastHydrated),
    selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
  };

  const sliceAdapter = createSliceAdapter<AsyncModelSliceState<TModel>>();

  const modifyState = (state: AsyncModelSliceState<TModel>, lastModified: string | null): AsyncModelSliceState<TModel> => {
    return sliceAdapter.setLastModified(state, lastModified);
  };

  const hydrateState = (state: AsyncModelSliceState<TModel>, lastHydrated: string | null): AsyncModelSliceState<TModel> => {
    return sliceAdapter.setLastHydrated(sliceAdapter.setLastModified(state, null), lastHydrated);
  };

  const actions: AsyncModelSliceSetActions<TAppState, TModel, TError> = {
    reset: (set) => () => set(state => ({
      ...state,
      [options.name]: {
        ...state[options.name] as unknown as AsyncModelSliceState<TModel>,
        ...initialState, 
      }, 
    })),
    hydrate: (set) => (model) => set(state => ({
      ...state,
      [options.name]: hydrateState({
        ...state[options.name] as unknown as AsyncModelSliceState<TModel>,
        model: model,
      }, getISOString()),
    })),
    update: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState({
        ...state[options.name] as unknown as AsyncModelSliceState<TModel>,
        model: model, 
      }, getISOString()), 
    })),
    set: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState({
        ...state[options.name] as unknown as AsyncModelSliceState<TModel>,
        model: model, 
      }, getISOString()), 
    })),
    setError: (set) => (error) => set(state => ({
      ...state,
      [options.name]: modifyState({
        ...state[options.name] as unknown as AsyncModelSliceState<TModel>,
        error: error, 
      }, getISOString()), 
    })),
    setStatus: (set) => (status) => set(state => ({
      ...state,
      [options.name]: modifyState({
        ...state[options.name] as unknown as AsyncModelSliceState<TModel>,
        status: status, 
      }, getISOString()), 
    })),
  };

  return ({
    name: options.name,
    actions: actions,
    selectors: selectors,
    state: initialState,
  });
};

export default createAsyncModelSlice;
