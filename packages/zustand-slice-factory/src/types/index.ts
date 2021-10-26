import { SetState } from 'zustand';
import { EntityStateType } from '../models/entity-state';
import { ModelStateType } from '../models/model-state';

export type Comparer<TModel> = (a: TModel, b: TModel) => number;

export type EntityId = number | string;

export type Action<TArguments extends any[] = undefined[]> = (...args: TArguments) => void;

export type SetAction<TAppState extends object, TArguments extends any[] = undefined[]> = (set: SetState<TAppState>) => Action<TArguments>;

export type Selector<TAppState extends object, TReturnType, TArguments extends any[] = undefined[]> = TArguments extends undefined[]
  ? (appState: TAppState) => TReturnType
  : (...args: TArguments) => (appState: TAppState) => TReturnType;

export type SliceSelectors<TAppState extends object, TSliceState, TActionsState extends Record<string, Action<any[]>> = Record<string, Action<any[]>>> = {
  selectSliceState: Selector<TAppState, TSliceState>
  selectActions: (state: TAppState) => TActionsState
};

export type MetaSliceSelectors<TAppState extends object> = {
  // selectError: Selector<TAppState, TError>;
  selectLastModified: Selector<TAppState, string | null>;
  selectLastHydrated: Selector<TAppState, string | null>;
};

export type ModelSliceSelectors<TAppState extends object, TModel extends object> = SliceSelectors<TAppState, ModelStateType<TModel>, ModelSliceStateActions<TModel>> & MetaSliceSelectors<TAppState> & {
  selectModel: (state: TAppState) => TModel;
};

export type EntitySliceSelectors<TAppState extends object, TEntity extends object> = SliceSelectors<TAppState, EntityStateType<TEntity>, EntitySliceStateActions<TEntity>> & MetaSliceSelectors<TAppState> & {
  selectIds: Selector<TAppState, EntityId[]>;
  selectEntities: Selector<TAppState, Record<EntityId, TEntity>>;
  selectAll: Selector<TAppState, TEntity[]>;
  selectTotal: Selector<TAppState, number>;
  selectById: Selector<TAppState, TEntity | undefined, [EntityId]>;
};

export type SliceStateActions = {
  reset: Action;
};

export type ModelSliceStateActions<TModel extends object> = SliceStateActions & {
  hydrate: Action<[TModel]>;
  set: Action<[TModel]>;
  update: Action<[TModel]>;
};

export type EntitySliceStateActions<TEntity extends object> = SliceStateActions & {
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

export type SliceActions<TAppState extends object> = {
  reset: SetAction<TAppState>;
};

export type ModelSliceActions<TAppState extends object, TModel extends object> = SliceActions<TAppState> & {
  hydrate: SetAction<TAppState, [TModel]>;
  set: SetAction<TAppState, [TModel]>;
  update: SetAction<TAppState, [TModel]>;
};

export type EntitySliceSetActions<TAppState extends object, TEntity extends object> = SliceActions<TAppState> & {
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
