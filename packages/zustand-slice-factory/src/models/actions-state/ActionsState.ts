import { SetState } from 'zustand';
import { Action, SetAction } from '../../types';

export const createStateActions = <
  TAppState extends object,
  TSliceStateActions extends Record<string, Action<any[]>> = Record<string, Action<any[]>>,
  TSliceActions extends Record<string, SetAction<TAppState, any[]>> = Record<string, SetAction<TAppState, any[]>>,
>(set: SetState<TAppState>, actions: TSliceActions): TSliceStateActions => Object.entries(actions)
    .reduce((acc, [key, entry]) => ({
      ...acc,
      [key]: entry(set),
    }), {} as TSliceStateActions);
