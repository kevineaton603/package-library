import { SetState } from 'zustand';
import StatusEnum from '../constants/StatusEnum';
export type { EntityStateType }  from '../models/entity-state';

export type Comparer<TModel> = (a: TModel, b: TModel) => number;

export type EntityId = number | string;

export type Action<TArguments extends any[] = undefined[], TReturn extends void | Promise<void> = void> = (...args: TArguments) => TReturn;

export type SetAction<TAppState extends object, TArguments extends any[] = undefined[], TReturn extends void | Promise<void> = void> = (set: SetState<TAppState>) => Action<TArguments, TReturn>;

export type Selector<TAppState extends object, TReturnType, TArguments extends any[] = undefined[]> = TArguments extends undefined[]
  ? (appState: TAppState) => TReturnType
  : (...args: TArguments) => (appState: TAppState) => TReturnType;

export type SliceSelectors<TAppState extends object, TSliceState, TActionsState extends Record<string, Action<any[]>> = Record<string, Action<any[]>>> = {
  selectSliceState: Selector<TAppState, TSliceState>
  selectActions: (state: TAppState) => TActionsState
};

export type MetaSliceSelectors<TAppState extends object> = {
  selectLastModified: Selector<TAppState, string | null>;
};

export type AsyncMetaSliceSelectors<TAppState extends object, TError extends Error = Error> = MetaSliceSelectors<TAppState> & {
  selectLastHydrated: Selector<TAppState, string | null>;
  selectError: Selector<TAppState, TError | null>;
  selectStatus: Selector<TAppState, StatusEnum>;
};

export type SliceStateActions = {
  reset: Action;
};

export type SliceSetActions<TAppState extends object> = {
  reset: SetAction<TAppState>;
};

export type AsyncSliceStateActions<TError extends Error = Error> = SliceStateActions & {
  setError: Action<[TError]>;
  setStatus: Action<[StatusEnum]>;
};

export type AsyncSliceSetActions<TAppState extends object, TError extends Error = Error> = SliceSetActions<TAppState> & {
  setError: SetAction<TAppState, [TError | null]>;
  setStatus: SetAction<TAppState, [StatusEnum]>;
};

export type SelectIdMethod<TEntity extends object> = (model: TEntity) => EntityId;
