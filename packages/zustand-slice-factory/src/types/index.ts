import { SetState } from 'zustand';

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
  selectLastModified: Selector<TAppState, string | null>;
  selectLastHydrated: Selector<TAppState, string | null>;
};

export type SliceStateActions = {
  reset: Action;
};

export type SliceSetActions<TAppState extends object> = {
  reset: SetAction<TAppState>;
};

export type SelectIdMethod<TEntity extends object> = (model: TEntity) => EntityId;
