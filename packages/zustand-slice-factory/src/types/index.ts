import { EntityStateType } from '../models/entity-state';
import { ModelStateType } from '../models/model-state';

export type Comparer<TModel> = (a: TModel, b: TModel) => number;

export type EntityId = number | string;

export type SetAction<TAppState extends object> = (state: TAppState) => void;

export type Action<TAppState extends object, TArguments extends any[] = undefined[]> = (...args: TArguments)  => SetAction<TAppState>;

export type Selector<TAppState extends object, TReturnType, TArguments extends any[] = undefined[]> = TArguments extends undefined[]
  ? (appState: TAppState) => TReturnType
  : (...args: TArguments) => (appState: TAppState) => TReturnType;

export type SliceSelectors<TAppState extends object, TSliceState> = {
  selectSliceState: Selector<TAppState, TSliceState>
};

export type MetaSliceSelectors<TAppState extends object> = {
  // selectError: Selector<TAppState, TError>;
  selectLastModified: Selector<TAppState, string | null>;
  selectLastHydrated: Selector<TAppState, string | null>;
};

export type ModelSliceSelectors<TAppState extends object, TModel extends object> = SliceSelectors<TAppState, ModelStateType<TModel>> & MetaSliceSelectors<TAppState> & {
  selectModel: (state: TAppState) => TModel;
};

export type EntitySliceSelectors<TAppState extends object, TEntity extends object> = SliceSelectors<TAppState, EntityStateType<TAppState, TEntity>> & MetaSliceSelectors<TAppState> & {
  selectIds: Selector<TAppState, EntityId[]>;
  selectEntities: Selector<TAppState, Record<EntityId, TEntity>>;
  selectAll: Selector<TAppState, TEntity[]>;
  selectTotal: Selector<TAppState, number>;
  selectById: Selector<TAppState, TEntity | undefined, [EntityId]>;
};

export type SliceActions<TAppState extends object> = {
  reset: Action<TAppState>;
};

export type ModelSliceActions<TAppState extends object, TModel extends object> = SliceActions<TAppState> & {
  hydrate: Action<TAppState, [TModel]>;
  set: Action<TAppState, [TModel]>;
  update: Action<TAppState, [TModel]>;
};

export type EntitySliceActions<TAppState extends object, TEntity extends object> = SliceActions<TAppState> & {
  /**
     * accepts a single entity, and adds it if it's not already present
     */
  addOne: Action<TAppState, [TEntity]>;
  /**
     * accepts an array of entities or an object in the shape of Record<EntityId, TEntity>, and adds them if not already present
     */
  addMany: Action<TAppState, [TEntity[]]>;
  hydrateOne: Action<TAppState, [TEntity]>
  hydrateMany: Action<TAppState, [TEntity[]]>;
  hydrateAll: Action<TAppState, [TEntity[]]>;
  // updateOne: Action<TAppState, TEntity>;
  // updateMany: Action<TAppState, TEntity[]>;
  upsertOne: Action<TAppState, [TEntity]>;
  upsertMany: Action<TAppState, [TEntity[]]>;
  removeOne: Action<TAppState, [EntityId]>;
  removeMany: Action<TAppState, [EntityId[]]>;
  removeAll: Action<TAppState>;
  setAll: Action<TAppState, [TEntity[]]>;
};
