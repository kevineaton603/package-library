/**
 * @jest-environment jsdom
 */
import create from 'zustand';
import createVanilla, { SetState } from 'zustand/vanilla';
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks';
import createModelSlice, { createActionsState, ModelSliceState } from './CreateModelSlice';
import { Action, ModelSliceActions, ModelSliceStateActions, SetAction } from '../../types';
import { createStateActions } from '../../models/actions-state/ActionsState';

type DuckModel = {
  noise: string;
  elevation: number;
};

const slice = createModelSlice<AppState, DuckModel>({
  name: 'Duck',
  selectSliceState: (appState) => appState.Duck,
});

type DuckActions = ModelSliceActions<AppState, DuckModel> & { setNoise: SetAction<AppState, [string]> };

type DuckStateActions = ModelSliceStateActions<DuckModel> & { setNoise: Action<[string]> };

type DuckSliceState = ModelSliceState<DuckModel, DuckStateActions>;

type AppState = {
  Duck: DuckSliceState;
};

const setNoise: SetAction<AppState, [string]> = (set: SetState<AppState>) => (noise: string) => {
  return set(state => ({
    ...state,
    [slice.name]: {
      ...state[slice.name],
      noise: noise,
    },
  }));
};

const allActions = {
  ...slice.actions,
  setNoise: setNoise,
};

// const a: () => SetAction<AppState, [string]> = () => {
//   return (set) => () => set() 
// };

describe('Testing Zustand', () => {
  const useStore = create<AppState>((set) => ({
    Duck: {
      ...slice.state,
      actions: createActionsState<AppState, DuckModel, DuckStateActions, DuckActions>(set, allActions),
    },
  }));

  const logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test hydrate action', () => {
    const { result } = renderHook(() => useStore(slice.selectors.selectActions));
    result.current.hydrate({
      noise: 'Quack',
      elevation: 10000, 
    });
    expect(useStore.getState().Duck.model?.noise).toBe('Quack');
    expect(useStore.getState().Duck.model?.elevation).toBe(10000);
    result.current.reset();
    expect(useStore.getState().Duck.lastHydrated).toBe(null);
  });

  it('Test update action', () => {});

  it('Test set action', () => {});
});

describe('Testing Zustand Vanilla', () => {
  const store = createVanilla<AppState>((set) => ({
    Duck: {
      ...slice.state,
      actions: createStateActions<AppState, DuckStateActions, DuckActions>(set, allActions),
    },
  }));

  const logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test hydrate action', () => {
    const { Duck } = store.getState();
    Duck.actions.hydrate({
      noise: 'Quack',
      elevation: 10000, 
    });
    
    expect(store.getState().Duck.model?.noise).toBe('Quack');
    expect(store.getState().Duck.model?.elevation).toBe(10000);
    Duck.actions.reset();
    expect(store.getState().Duck.lastHydrated).toBe(null);
  });

  it('Test update action', () => {});

  it('Test set action', () => {});
});
