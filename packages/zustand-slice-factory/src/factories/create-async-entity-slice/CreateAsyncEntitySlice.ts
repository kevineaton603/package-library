import { createSelector } from 'reselect';
import createEntityAdapter from '../../adapters/create-entity-adapter';
import createSliceAdapter from '../../adapters/create-slice-adapter';
import AsyncEntityState, { AsyncEntityStateType } from '../../models/async-entity-state';
import { Action, AsyncMetaSliceSelectors, AsyncSliceSetActions, AsyncSliceStateActions, Comparer, EntityId, SelectIdMethod, Selector, SetAction, SliceSelectors } from '../../types';
import { getISOString } from '../../utils';

export type AsyncEntitySliceSetActions<TAppState extends object, TEntity extends object, TError extends Error = Error> = AsyncSliceSetActions<TAppState, TError> & {
  addOne: SetAction<TAppState, [TEntity]>;
  addMany: SetAction<TAppState, [TEntity[]]>;
  hydrateOne: SetAction<TAppState, [TEntity]>
  hydrateMany: SetAction<TAppState, [TEntity[]]>;
  hydrateAll: SetAction<TAppState, [TEntity[]]>;
  upsertOne: SetAction<TAppState, [TEntity]>;
  upsertMany: SetAction<TAppState, [TEntity[]]>;
  removeOne: SetAction<TAppState, [EntityId]>;
  removeMany: SetAction<TAppState, [EntityId[]]>;
  removeAll: SetAction<TAppState>;
  setAll: SetAction<TAppState, [TEntity[]]>;
};
  
export type AsyncEntitySliceStateActions<TEntity extends object, TError extends Error = Error> = AsyncSliceStateActions<TError> & {
  addOne: Action<[TEntity]>;
  addMany: Action<[TEntity[]]>;
  hydrateOne: Action<[TEntity]>
  hydrateMany: Action<[TEntity[]]>;
  hydrateAll: Action<[TEntity[]]>;
  upsertOne: Action<[TEntity]>;
  upsertMany: Action<[TEntity[]]>;
  removeOne: Action<[EntityId]>;
  removeMany: Action<[EntityId[]]>;
  removeAll: Action;
  setAll: Action<[TEntity[]]>;
};

export type AsyncEntitySliceState<TModel extends object, TError extends Error = Error, TSliceActions extends AsyncEntitySliceStateActions<TModel, TError> = AsyncEntitySliceStateActions<TModel, TError>> = 
  AsyncEntityStateType<TModel, TError> & {
    actions: TSliceActions
  };

export type AsyncEntitySliceSelectors<TAppState extends object, TEntity extends object, TError extends Error = Error> = 
  SliceSelectors<TAppState, AsyncEntityStateType<TEntity, TError>, AsyncEntitySliceStateActions<TEntity, TError>> & AsyncMetaSliceSelectors<TAppState, TError> & {
    selectIds: Selector<TAppState, EntityId[]>;
    selectEntities: Selector<TAppState, Record<EntityId, TEntity>>;
    selectAll: Selector<TAppState, TEntity[]>;
    selectTotal: Selector<TAppState, number>;
    selectById: Selector<TAppState, TEntity | undefined, [EntityId]>;
  };

type AsyncEntitySliceOptions<TAppState extends object, TModel extends object, TError extends Error = Error> = {
  name: keyof TAppState;
  selectSliceState: (appState: TAppState) => AsyncEntitySliceState<TModel, TError>;
  selectId: SelectIdMethod<TModel> | keyof TModel;
  sortComparer: Comparer<TModel>; // | false;
  initialState?: Partial<AsyncEntityStateType<TModel, TError>>;
};

export type AsyncModelSlice<TAppState extends object, TModel extends object, TError extends Error = Error> = {
  name: keyof TAppState;
  actions: AsyncEntitySliceSetActions<TAppState, TModel, TError>;
  selectors: AsyncEntitySliceSelectors<TAppState, TModel, TError>;
  state: AsyncEntityStateType<TModel, TError>;
};

const createAsyncEntitySlice = <TAppState extends object, TEntity extends object, TError extends Error = Error>(options: AsyncEntitySliceOptions<TAppState, TEntity, TError>): AsyncModelSlice<TAppState, TEntity, TError> => {
  const initialState = AsyncEntityState.create<TEntity, TError>(options.initialState);

  const selectors: AsyncEntitySliceSelectors<TAppState, TEntity, TError> = {
    selectSliceState: createSelector(options.selectSliceState, (model) => model),
    selectActions: createSelector(options.selectSliceState, (model) => model.actions),
    selectEntities: createSelector(options.selectSliceState, (model) => model.entities),
    selectIds: createSelector(options.selectSliceState, (model) => model.ids),
    selectTotal: createSelector(options.selectSliceState, (model) => model.ids.length),
    selectAll: createSelector(options.selectSliceState, (model) => Object.values(model.entities)),
    selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
    selectLastHydrated: createSelector(options.selectSliceState, (model) => model.lastHydrated),
    selectById: (id: EntityId) => createSelector(options.selectSliceState, (model) => model.entities?.[id]),
    selectStatus: createSelector(options.selectSliceState, (model) => model.status),
    selectError: createSelector(options.selectSliceState, (model) => model.error),
  };

  const entityAdapter = createEntityAdapter<TEntity, AsyncEntitySliceState<TEntity, TError>>({
    selectId: options.selectId,
    sortComparer: options.sortComparer,
  });

  const sliceAdapter = createSliceAdapter<AsyncEntitySliceState<TEntity, TError>>();

  const modifyState = (state: AsyncEntitySliceState<TEntity, TError>, lastModified: string | null): AsyncEntitySliceState<TEntity, TError> => {
    return sliceAdapter.setLastModified(state, lastModified);
  };

  const hydrateState = (state: AsyncEntitySliceState<TEntity, TError>, lastHydrated: string | null): AsyncEntitySliceState<TEntity, TError> => {
    return sliceAdapter.setLastHydrated(sliceAdapter.setLastModified(state, null), lastHydrated);
  };

  const actions: AsyncEntitySliceSetActions<TAppState, TEntity, TError> = {
    addMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.addMany(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, models), getISOString()),  
    })),
    addOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.addOne(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, model), getISOString()), 
    })),
    hydrateAll:  (set) => (models) => set(state => ({
      ...state,
      [options.name]: hydrateState(entityAdapter.setAll(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, models), getISOString()), 
    })),
    hydrateMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: hydrateState(entityAdapter.upsertMany(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, models), getISOString()), 
    })),
    hydrateOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: hydrateState(entityAdapter.upsertOne(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, model), getISOString()), 
    })),
    removeAll: (set) => () => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.removeAll(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>), getISOString()), 
    })),
    removeMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.removeMany(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, models), getISOString()), 
    })),
    removeOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.removeOne(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, model), getISOString()), 
    })),
    reset: (set) => () => set(state => ({
      ...state,
      [options.name]: {
        ...state[options.name],
        ...initialState,
      }, 
    })),
    setAll: (set) => (models) =>  set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.setAll(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, models), getISOString()), 
    })),
    setError: (set) => (error) => set(state => ({
      ...state,
      [options.name]: modifyState({
        ...state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>,
        error: error, 
      }, getISOString()), 
    })),
    setStatus: (set) => (status) => set(state => ({
      ...state,
      [options.name]: modifyState({
        ...state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>,
        status: status, 
      }, getISOString()), 
    })),
    upsertMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.upsertMany(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, models), getISOString()), 
    })),
    upsertOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.upsertOne(state[options.name] as unknown as AsyncEntitySliceState<TEntity, TError>, model), getISOString()), 
    })),
  };

  return ({
    name: options.name,
    actions: actions,
    selectors: selectors,
    state: initialState,
  });
};

export default createAsyncEntitySlice;
