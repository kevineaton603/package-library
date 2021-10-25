/**
 * @jest-environment jsdom
 */
import create from 'zustand';
import createVanilla from 'zustand/vanilla';
// eslint-disable-next-line import/no-extraneous-dependencies
import { renderHook } from '@testing-library/react-hooks';
import createModelSlice, { ModelSliceState } from './CreateModelSlice';

type DuckModel = {
  noise: string;
  elevation: number;
};

const slice = createModelSlice<AppState, DuckModel>({
  name: 'Duck',
  selectSliceState: (appState) => appState.Duck,
});

const DuckState = {
  ...slice.state,
  actions: slice.actions,
};

type DuckSliceState = ModelSliceState<AppState, DuckModel>;

type AppState = {
  Duck: DuckSliceState;
};

describe('Testing Zustand', () => {
  const useStore = create<AppState>(() => ({
    Duck: DuckState,
  }));

  const logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test hydrate action', () => {
    // renderHook(() => useStore(slice.actions.hydrate({ noise: 'Quack', elevation: 1000})));
    useStore.setState(slice.actions.hydrate({
      noise: 'Quack',
      elevation: 10000, 
    }));
    expect(useStore.getState().Duck.model?.noise).toBe('Quack');
    expect(useStore.getState().Duck.model?.elevation).toBe(10000);
    renderHook(() => useStore(slice.actions.reset()));
    expect(useStore.getState().Duck.lastHydrated).toBe(null);
  });

  it('Test update action', () => {});

  it('Test set action', () => {});
});

describe('Testing Zustand Vanilla', () => {
  const useStore = createVanilla<AppState>(() => ({
    Duck: DuckState,
  }));

  const logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test hydrate action', () => {
    useStore.setState(slice.actions.hydrate({
      noise: 'Quack',
      elevation: 10000, 
    }));
    expect(useStore.getState().Duck.model?.noise).toBe('Quack');
    expect(useStore.getState().Duck.model?.elevation).toBe(10000);
    useStore.setState(slice.actions.reset());
    expect(useStore.getState().Duck.lastHydrated).toBe(null);
  });

  it('Test update action', () => {});

  it('Test set action', () => {});
});
