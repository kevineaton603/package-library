/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react-hooks';
import create from 'zustand';
import createVanilla from 'zustand/vanilla';
import { EntitySliceActions, EntitySliceStateActions } from '../..';
import { createStateActions } from '../../models/actions-state/ActionsState';
import createEntitySlice, { EntitySliceState } from './CreateEntitySlice';

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
      actions: createStateActions<AppState, EntitySliceStateActions<AnimalModel>, EntitySliceActions<AppState, AnimalModel>>(set, slice.actions),
    },
  }));

  let logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test hydrate action', () => {
    const { result } = renderHook(() => useStore(slice.selectors.selectActions));
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
    expect(useStore.getState().Animal.entities?.Duck?.noise).toBe('Quack');
    expect(useStore.getState().Animal.entities?.Duck?.name).toBe('Duck');
    result.current.reset();
    expect(useStore.getState().Animal.lastHydrated).toBe(null);
  });

  it('Test update action', () => {});

  it('Test set action', () => {});
});

describe('Testing Zustand Vanilla', () => {
  const useStore = createVanilla<AppState>((set) => ({
    Animal: {
      ...slice.state,
      actions: createStateActions<AppState, EntitySliceStateActions<AnimalModel>, EntitySliceActions<AppState, AnimalModel>>(set, slice.actions),
    },
  }));

  let logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });
  it('Test hydrate action', () => {
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
    expect(useStore.getState().Animal.lastHydrated).toBe(null);
  });

  it('Test update action', () => {});

  it('Test set action', () => {});
});

