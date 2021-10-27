/**
 * @jest-environment jsdom
 */
import create from 'zustand';
import createVanilla, { SetState } from 'zustand/vanilla';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act, renderHook } from '@testing-library/react-hooks';
import createModelSlice, { ModelSliceSetActions, ModelSliceStateActions } from './CreateModelSlice';
import { Action, SetAction } from '../../types';
import { createStateActions } from '../../models/actions-state/ActionsState';
import { PremiumProfile, TestAppState, UserProfileModel } from '../../fixtures';

type AppState = Omit<TestAppState, 'Followers'>;

const slice = createModelSlice<AppState, UserProfileModel>({
  name: 'User',
  selectSliceState: (appState) => appState.User,
});

type UserActions = ModelSliceSetActions<AppState, UserProfileModel> & { setNoise: SetAction<AppState, [string]> };

type UserStateActions = ModelSliceStateActions<UserProfileModel> & { setNoise: Action<[string]> };

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

describe('Testing Zustand', () => {
  const useStore = create<AppState>((set) => ({
    User: {
      ...slice.state,
      actions: createStateActions<AppState, UserStateActions, UserActions>(set, allActions),
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
    const { result: sliceState } = renderHook(() => useStore(slice.selectors.selectSliceState));
    act(() => {
      result.current.hydrate(PremiumProfile.model);
    });
    
    expect(sliceState.current.model?.username).toBe(PremiumProfile.model.username);
    expect(sliceState.current.model?.url).toBe(PremiumProfile.model.url);
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBe(null);
  });

  it('Test update action', () => {});

  it('Test set action', () => {});
});

describe('Testing Zustand Vanilla', () => {
  const store = createVanilla<AppState>((set) => ({
    User: {
      ...slice.state,
      actions: createStateActions<AppState, UserStateActions, UserActions>(set, allActions),
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
    const { User } = store.getState();
    User.actions.hydrate(PremiumProfile.model);
    
    expect(store.getState().User.model?.username).toBe(PremiumProfile.model.username);
    expect(store.getState().User.model?.url).toBe(PremiumProfile.model.url);
    User.actions.reset();
    expect(store.getState().User.lastHydrated).toBe(null);
  });

  it('Test update action', () => {});

  it('Test set action', () => {});
});
