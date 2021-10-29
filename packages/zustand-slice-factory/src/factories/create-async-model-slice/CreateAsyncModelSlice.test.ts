/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import create from 'zustand';
import { AsyncModelSliceStateActions, AsyncModelSliceSetActions } from './CreateAsyncModelSlice';
import { PremiumProfile, UserProfileModel } from '../../fixtures';
import { createStateActions } from '../../models/actions-state/ActionsState';
import createAsyncModelSlice, { AsyncModelSliceState } from './CreateAsyncModelSlice';

type AppState = {
  User: AsyncModelSliceState<UserProfileModel>;
};

const slice = createAsyncModelSlice<AppState, UserProfileModel, Error>({
  name: 'User',
  selectSliceState: (appState) => appState.User,
});

describe('Testing Zustand', () => {
  const useStore = create<AppState>((set) => ({
    User: {
      ...slice.state,
      actions: createStateActions<AppState, AsyncModelSliceStateActions<UserProfileModel>, AsyncModelSliceSetActions<AppState, UserProfileModel>>(set, slice.actions),
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
    expect(sliceState.current.lastHydrated).toBeTruthy();
    expect(sliceState.current.lastModified).toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
  });
  
  it('Test update action', () => {
    const { result } = renderHook(() => useStore(slice.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useStore(slice.selectors.selectSliceState));
    act(() => {
      result.current.update(PremiumProfile.model);
    });
      
    expect(sliceState.current.model?.username).toBe(PremiumProfile.model.username);
    expect(sliceState.current.model?.url).toBe(PremiumProfile.model.url);
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeTruthy();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
  });
  
  it('Test set action', () => {
    const { result } = renderHook(() => useStore(slice.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useStore(slice.selectors.selectSliceState));
    act(() => {
      result.current.set(PremiumProfile.model);
    });
      
    expect(sliceState.current.model?.username).toBe(PremiumProfile.model.username);
    expect(sliceState.current.model?.url).toBe(PremiumProfile.model.url);
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeTruthy();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
  });
});
