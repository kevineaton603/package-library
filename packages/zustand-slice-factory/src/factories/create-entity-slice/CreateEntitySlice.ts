import { createSelector } from 'reselect';
import createEntityAdapter, { SelectIdMethod } from '../../adapters/create-entity-adapter/CreateEntityAdapter';
import createSliceAdapter from '../../adapters/create-slice-adapter';
import EntityState, { EntityStateType } from '../../models/entity-state';
import { Comparer, EntityId, EntitySliceActions, EntitySliceSelectors } from '../../types';

type EntitySliceOptions<TAppState extends object, TModel extends object> = {
  name: keyof TAppState;
  selectSliceState: (appState: TAppState) => EntityStateType<TAppState, TModel>;
  selectId: SelectIdMethod<TModel> | keyof TModel;
  sortComparer: Comparer<TModel>; // | false;
  initialState?: Partial<EntityStateType<TAppState, TModel>>;
};

export type EntitySliceState<TAppState extends object, TModel extends object, TSliceActions extends EntitySliceActions<TAppState, TModel> = EntitySliceActions<TAppState, TModel>> = EntityStateType<TAppState, TModel> & {
  actions: TSliceActions
};

export type EntitySlice<TAppState extends object, TModel extends object> = {
  name: keyof TAppState;
  actions: EntitySliceActions<TAppState, TModel>;
  selectors: EntitySliceSelectors<TAppState, TModel>;
  state: EntityStateType<TAppState, TModel>;
};

const createEntitySlice = <TAppState extends object, TEntity extends object>(options: EntitySliceOptions<TAppState, TEntity>) : EntitySlice<TAppState, TEntity>  => {

  const selectors: EntitySliceSelectors<TAppState, TEntity> = {
    selectSliceState: createSelector(options.selectSliceState, (model) => model),
    selectEntities: createSelector(options.selectSliceState, (model) => model.entities),
    selectIds: createSelector(options.selectSliceState, (model) => model.ids),
    selectTotal: createSelector(options.selectSliceState, (model) => model.ids.length),
    selectAll: createSelector(options.selectSliceState, (model) => Object.values(model.entities)),
    selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
    selectLastHydrated: createSelector(options.selectSliceState, (model) => model.lastHydrated),
    selectById: (id: EntityId) => createSelector(options.selectSliceState, (model) => model.entities?.[id]),
  };

  const entityAdapter = createEntityAdapter<TAppState, TEntity>({
    selectId: options.selectId,
    sortComparer: options.sortComparer, 
  });
  const sliceAdapter = createSliceAdapter();

  const actions: EntitySliceActions<TAppState, TEntity> = {
    addMany: (models) => (state: TAppState) => ({
      ...state,
      [options.name]: sliceAdapter.setLastModified(entityAdapter.addMany(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, models), null),  
    }),
    addOne: (model) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.addOne(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, model), 
    }),
    hydrateAll: (models) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.setAll(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, models), 
    }),
    hydrateMany: (models) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.upsertMany(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, models), 
    }),
    hydrateOne: (model) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.upsertOne(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, model), 
    }),
    removeAll: () => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.removeAll(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>), 
    }),
    removeMany: (models) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.removeMany(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, models), 
    }),
    removeOne: (model) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.removeOne(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, model), 
    }),
    
    reset: () => (state: TAppState) => ({
      ...state,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      [options.name]: initialState, 
    }),
    setAll: (models) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.setAll(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, models), 
    }),
    // updateMany,
    // updateOne,
    upsertMany: (models) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.upsertMany(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, models), 
    }),
    upsertOne: (model) => (state: TAppState) => ({
      ...state,
      [options.name]: entityAdapter.upsertOne(state[options.name] as unknown as EntitySliceState<TAppState, TEntity>, model), 
    }),
  };

  const initialState = EntityState.create<TAppState, TEntity>({
    ...options?.initialState,
    actions: actions,
  });

  return ({
    name: options.name,
    selectors: selectors,
    actions: actions,
    state: initialState,
  });
};

export default createEntitySlice;
