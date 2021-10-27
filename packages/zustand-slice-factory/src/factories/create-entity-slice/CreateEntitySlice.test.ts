/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import { createStateActions } from '../../models/actions-state/ActionsState';
import createEntitySlice, { EntitySliceState, EntitySliceSetActions, EntitySliceStateActions } from './CreateEntitySlice';

type AnimalModel = {
  name: string;
  noise: string;
};

const slice = createEntitySlice<AppState, AnimalModel>({
  name: 'Animal',
  selectSliceState: (appState) => appState.Animal,
  selectId: (entity) => {
    if (!entity.name) {
      throw new Error('Missing required property: name');
    }
    return entity.name;
  },
  sortComparer: (entityA, entityB) => {
    if (!entityA.name) {
      throw new Error('Missing required property: name');
    }
    if (!entityB.name) {
      throw new Error('Missing required property: name');
    }
    return entityA.name.localeCompare(entityA.name);
  },
});

type AnimalSliceState = EntitySliceState<AnimalModel>;

type AppState = {
  Animal: AnimalSliceState;
};

describe('Testing Zustand', () => {
  const useStore = create<AppState>((set) => ({
    Animal: {
      ...slice.state,
      actions: createStateActions<AppState, EntitySliceStateActions<AnimalModel>, EntitySliceSetActions<AppState, AnimalModel>>(set, slice.actions),
    },
  }));

  let logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test hydrateAll action', () => {
    const { result } = renderHook(() => useStore(slice.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useStore(slice.selectors.selectSliceState));
    act(() => {
      result.current.hydrateAll([
        {
          name: 'Duck',
          noise: 'Quack',
        },
        {
          name: 'Cow',
          noise: 'Moo',
        },
      ]);
    });

    expect(sliceState.current.entities?.Duck?.noise).toBe('Quack');
    expect(sliceState.current.entities?.Duck?.name).toBe('Duck');
    expect(sliceState.current.lastHydrated).toBeTruthy();
    expect(sliceState.current.lastModified).toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeNull();
  });

  it('Test updateMany action', () => {
    const { result } = renderHook(() => useStore(slice.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useStore(slice.selectors.selectSliceState));
    act(() => {
      result.current.upsertMany([
        {
          name: 'Duck',
          noise: 'Quack',
        },
        {
          name: 'Cow',
          noise: 'Moo',
        },
      ]);
    });

    expect(sliceState.current.entities?.Duck?.noise).toBe('Quack');
    expect(sliceState.current.entities?.Duck?.name).toBe('Duck');
    expect(sliceState.current.lastModified).toBeTruthy();
    expect(sliceState.current.lastHydrated).toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeNull();
  });

  it('Test setAll action', () => {
    const { result } = renderHook(() => useStore(slice.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useStore(slice.selectors.selectSliceState));
    act(() => {
      result.current.setAll([
        {
          name: 'Duck',
          noise: 'Quack',
        },
        {
          name: 'Cow',
          noise: 'Moo',
        },
      ]);
    });

    expect(sliceState.current.entities?.Duck?.noise).toBe('Quack');
    expect(sliceState.current.entities?.Duck?.name).toBe('Duck');
    expect(sliceState.current.lastModified).toBeTruthy();
    expect(sliceState.current.lastHydrated).toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeNull();
  });
});

describe('Testing Zustand Vanilla', () => {
  const useStore = createVanilla<AppState>((set) => ({
    Animal: {
      ...slice.state,
      actions: createStateActions<AppState, EntitySliceStateActions<AnimalModel>, EntitySliceSetActions<AppState, AnimalModel>>(set, slice.actions),
    },
  }));

  let logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });
  it('Test hydrateAll action', () => {
    const { Animal } = useStore.getState();
    Animal.actions.hydrateAll([
      {
        name: 'Duck',
        noise: 'Quack',
      },
      {
        name: 'Cow',
        noise: 'Moo',
      },
    ]);
    expect(useStore.getState().Animal.entities?.Duck?.noise).toBe('Quack');
    expect(useStore.getState().Animal.entities?.Duck?.name).toBe('Duck');
    Animal.actions.reset();
    expect(useStore.getState().Animal.lastHydrated).toBeNull();
  });

  it('Test upsertMany action', () => {
    const { Animal } = useStore.getState();
    Animal.actions.upsertMany([
      {
        name: 'Duck',
        noise: 'Quack',
      },
      {
        name: 'Cow',
        noise: 'Moo',
      },
    ]);
    let state = useStore.getState();
    expect(state.Animal.entities?.Duck?.noise).toBe('Quack');
    expect(state.Animal.entities?.Duck?.name).toBe('Duck');
    expect(state.Animal.lastHydrated).toBeFalsy();
    expect(state.Animal.lastModified).toBeTruthy();
    Animal.actions.reset();
    state = useStore.getState();
    expect(state.Animal.lastHydrated).toBeNull();
  });

  it('Test setAll action', () => {
    const { Animal } = useStore.getState();
    Animal.actions.setAll([
      {
        name: 'Duck',
        noise: 'Quack',
      },
      {
        name: 'Cow',
        noise: 'Moo',
      },
    ]);
    let state = useStore.getState();
    expect(state.Animal.entities?.Duck?.noise).toBe('Quack');
    expect(state.Animal.entities?.Duck?.name).toBe('Duck');
    expect(state.Animal.lastHydrated).toBeFalsy();
    expect(state.Animal.lastModified).toBeTruthy();
    Animal.actions.reset();
    state = useStore.getState();
    expect(useStore.getState().Animal.lastHydrated).toBeNull();
  });
});

