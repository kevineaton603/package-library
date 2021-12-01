import { createSelector } from 'reselect';
import { SetState } from 'zustand';
import createEntityAdapter from '../../adapters/create-entity-adapter/CreateEntityAdapter';
import createSliceAdapter from '../../adapters/create-slice-adapter';
import { createStateActions } from '../../models/actions-state/ActionsState';
import EntityState, { EntityStateType } from '../../models/entity-state';
import { Comparer, EntityId, SliceStateActions, Action, SliceSetActions, SetAction, SliceSelectors, Selector, MetaSliceSelectors, SelectIdMethod } from '../../types';
import { getISOString } from '../../utils';

export type EntitySliceSetActions<TAppState extends object, TEntity extends object> = SliceSetActions<TAppState> & {
  addOne: SetAction<TAppState, [TEntity]>;
  addMany: SetAction<TAppState, [TEntity[]]>;
  upsertOne: SetAction<TAppState, [TEntity]>;
  upsertMany: SetAction<TAppState, [TEntity[]]>;
  removeOne: SetAction<TAppState, [EntityId]>;
  removeMany: SetAction<TAppState, [EntityId[]]>;
  removeAll: SetAction<TAppState>;
  setAll: SetAction<TAppState, [TEntity[]]>;
};

export type EntitySliceStateActions<TEntity extends object> = SliceStateActions & {
  addOne: Action<[TEntity]>;
  addMany: Action<[TEntity[]]>;
  upsertOne: Action<[TEntity]>;
  upsertMany: Action<[TEntity[]]>;
  removeOne: Action<[EntityId]>;
  removeMany: Action<[EntityId[]]>;
  removeAll: Action;
  setAll: Action<[TEntity[]]>;
};

export type EntitySliceSelectors<
  TAppState extends object,
  TEntity extends object,
  TSliceActions extends EntitySliceStateActions<TEntity> = EntitySliceStateActions<TEntity>,
> = SliceSelectors<TAppState, EntityStateType<TEntity>, TSliceActions> & MetaSliceSelectors<TAppState> & {
  selectIds: Selector<TAppState, EntityId[]>;
  selectEntities: Selector<TAppState, Record<EntityId, TEntity>>;
  selectAll: Selector<TAppState, TEntity[]>;
  selectTotal: Selector<TAppState, number>;
  selectById: Selector<TAppState, TEntity | undefined, [EntityId]>;
};

type EntitySliceOptions<
  TAppState extends object,
  TEntity extends object,
  TSliceActions extends EntitySliceStateActions<TEntity> = EntitySliceStateActions<TEntity>,
> = {
  name: keyof TAppState;
  selectSliceState: (appState: TAppState) => EntitySliceState<TEntity, TSliceActions>;
  selectId: SelectIdMethod<TEntity> | keyof TEntity;
  sortComparer: Comparer<TEntity>; // | false;
  initialState?: Partial<EntityStateType<TEntity>>;
};

export type EntitySliceState<TEntity extends object, TSliceActions extends EntitySliceStateActions<TEntity> = EntitySliceStateActions<TEntity>> = EntityStateType<TEntity> & {
  actions: TSliceActions
};

export const createEntitySliceState = <
  TAppState extends object,
  TEntity extends object,
  TSliceStateActions extends EntitySliceStateActions<TEntity> = EntitySliceStateActions<TEntity>,
  TSliceSetActions extends EntitySliceSetActions<TAppState, TEntity> = EntitySliceSetActions<TAppState, TEntity>,
>(set: SetState<TAppState>, state: EntityStateType<TEntity>, actions: TSliceSetActions): EntitySliceState<TEntity, TSliceStateActions> => ({
    ...state,
    actions: createStateActions<TAppState, TSliceStateActions, TSliceSetActions>(set, actions),
  });

export type EntitySlice<
  TAppState extends object,
  TEntity extends object,
  TSliceActions extends EntitySliceStateActions<TEntity> = EntitySliceStateActions<TEntity>,
> = {
  name: keyof TAppState;
  actions: EntitySliceSetActions<TAppState, TEntity>;
  selectors: EntitySliceSelectors<TAppState, TEntity, TSliceActions>;
  state: EntityStateType<TEntity>;
};

const createEntitySlice = <
  TAppState extends object,
  TEntity extends object,
  TSliceActions extends EntitySliceStateActions<TEntity> = EntitySliceStateActions<TEntity>,
>(options: EntitySliceOptions<TAppState, TEntity, TSliceActions>) : EntitySlice<TAppState, TEntity, TSliceActions>  => {

  const selectors: EntitySliceSelectors<TAppState, TEntity, TSliceActions> = {
    selectSliceState: createSelector(options.selectSliceState, (model) => model),
    selectActions: createSelector(options.selectSliceState, (model) => model.actions),
    selectEntities: createSelector(options.selectSliceState, (model) => model.entities),
    selectIds: createSelector(options.selectSliceState, (model) => model.ids),
    selectTotal: createSelector(options.selectSliceState, (model) => model.ids.length),
    selectAll: createSelector(options.selectSliceState, (model) => Object.values(model.entities)),
    selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
    selectById: (id: EntityId) => createSelector(options.selectSliceState, (model) => model.entities?.[id]),
  };

  const initialState = EntityState.create<TEntity>(options?.initialState);

  const entityAdapter = createEntityAdapter<TEntity>({
    selectId: options.selectId,
    sortComparer: options.sortComparer, 
  });
  const sliceAdapter = createSliceAdapter<EntitySliceState<TEntity>>();

  const modifyState = (state: EntitySliceState<TEntity>, lastModified: string | null): EntitySliceState<TEntity> => {
    return sliceAdapter.setLastModified(state, lastModified);
  };

  const actions: EntitySliceSetActions<TAppState, TEntity> = {
    addMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.addMany(state[options.name] as unknown as EntitySliceState<TEntity>, models), getISOString()),  
    })),
    addOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.addOne(state[options.name] as unknown as EntitySliceState<TEntity>, model), getISOString()), 
    })),
    removeAll: (set) => () => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.removeAll(state[options.name] as unknown as EntitySliceState<TEntity>), getISOString()), 
    })),
    removeMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.removeMany(state[options.name] as unknown as EntitySliceState<TEntity>, models), getISOString()), 
    })),
    removeOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.removeOne(state[options.name] as unknown as EntitySliceState<TEntity>, model), getISOString()), 
    })),
    reset: (set) => () => set(state => ({
      ...state,
      [options.name]: {
        actions: (state[options.name] as unknown as EntitySliceState<TEntity, TSliceActions>).actions,
        ...initialState,
      }, 
    })),
    setAll: (set) => (models) =>  set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.setAll(state[options.name] as unknown as EntitySliceState<TEntity>, models), getISOString()), 
    })),
    upsertMany: (set) => (models) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.upsertMany(state[options.name] as unknown as EntitySliceState<TEntity>, models), getISOString()), 
    })),
    upsertOne: (set) => (model) => set(state => ({
      ...state,
      [options.name]: modifyState(entityAdapter.upsertOne(state[options.name] as unknown as EntitySliceState<TEntity>, model), getISOString()), 
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
