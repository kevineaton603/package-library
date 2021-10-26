import { createSelector } from 'reselect';
import createEntityAdapter, { SelectIdMethod } from '../../adapters/create-entity-adapter/CreateEntityAdapter';
import createSliceAdapter from '../../adapters/create-slice-adapter';
import EntityState, { EntityStateType } from '../../models/entity-state';
import { Comparer, EntityId, EntitySliceActions, EntitySliceSelectors, EntitySliceStateActions } from '../../types';

type EntitySliceOptions<TAppState extends object, TModel extends object> = {
  name: keyof TAppState;
  selectSliceState: (appState: TAppState) => EntitySliceState<TModel>;
  selectId: SelectIdMethod<TModel> | keyof TModel;
  sortComparer: Comparer<TModel>; // | false;
  initialState?: Partial<EntityStateType<TModel>>;
};

export type EntitySliceState<TModel extends object, TSliceActions extends EntitySliceStateActions<TModel> = EntitySliceStateActions<TModel>> = EntityStateType<TModel> & {
  actions: TSliceActions
};

export type EntitySlice<TAppState extends object, TModel extends object> = {
  name: keyof TAppState;
  actions: EntitySliceActions<TAppState, TModel>;
  selectors: EntitySliceSelectors<TAppState, TModel>;
  state: EntityStateType<TModel>;
};

const createEntitySlice = <TAppState extends object, TEntity extends object>(options: EntitySliceOptions<TAppState, TEntity>) : EntitySlice<TAppState, TEntity>  => {

  const selectors: EntitySliceSelectors<TAppState, TEntity> = {
    selectSliceState: createSelector(options.selectSliceState, (model) => model),
    selectActions: createSelector(options.selectSliceState, (model) => model.actions),
    selectEntities: createSelector(options.selectSliceState, (model) => model.entities),
    selectIds: createSelector(options.selectSliceState, (model) => model.ids),
    selectTotal: createSelector(options.selectSliceState, (model) => model.ids.length),
    selectAll: createSelector(options.selectSliceState, (model) => Object.values(model.entities)),
    selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
    selectLastHydrated: createSelector(options.selectSliceState, (model) => model.lastHydrated),
    selectById: (id: EntityId) => createSelector(options.selectSliceState, (model) => model.entities?.[id]),
  };

  const initialState = EntityState.create<TEntity>(options?.initialState);

  const entityAdapter = createEntityAdapter<TEntity>({
    selectId: options.selectId,
    sortComparer: options.sortComparer, 
  });
  const sliceAdapter = createSliceAdapter();

  const actions: EntitySliceActions<TAppState, TEntity> = {
    addMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: sliceAdapter.setLastModified(entityAdapter.addMany(state[options.name] as unknown as EntitySliceState<TEntity>, models), null),  
    })),
    addOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: entityAdapter.addOne(state[options.name] as unknown as EntitySliceState<TEntity>, model), 
    })),
    hydrateAll:  (set) => (models) => set(state => ({
      ...state,
      [options.name]: entityAdapter.setAll(state[options.name] as unknown as EntitySliceState<TEntity>, models), 
    })),
    hydrateMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: entityAdapter.upsertMany(state[options.name] as unknown as EntitySliceState<TEntity>, models), 
    })),
    hydrateOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: entityAdapter.upsertOne(state[options.name] as unknown as EntitySliceState<TEntity>, model), 
    })),
    removeAll: (set) => () => set(state => ({
      ...state,
      [options.name]: entityAdapter.removeAll(state[options.name] as unknown as EntitySliceState<TEntity>), 
    })),
    removeMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: entityAdapter.removeMany(state[options.name] as unknown as EntitySliceState<TEntity>, models), 
    })),
    removeOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: entityAdapter.removeOne(state[options.name] as unknown as EntitySliceState<TEntity>, model), 
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
      [options.name]: entityAdapter.setAll(state[options.name] as unknown as EntitySliceState<TEntity>, models), 
    })),
    upsertMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: entityAdapter.upsertMany(state[options.name] as unknown as EntitySliceState<TEntity>, models), 
    })),
    upsertOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: entityAdapter.upsertOne(state[options.name] as unknown as EntitySliceState<TEntity>, model), 
    })),
  };

  return ({
    name: options.name,
    selectors: selectors,
    actions: actions,
    state: initialState,
  });
};

export default createEntitySlice;
