/**
 * @jest-environment jsdom
 */
import create from 'zustand';
import createModelSlice from '../factories/create-model-slice';
import createEntitySlice from '../factories/create-entity-slice';
import { AdminProfile, BasicProfile, PremiumProfile, TestAppState, UserProfileModel } from '../fixtures';
import { createStateActions } from '../models/actions-state/ActionsState';
import { act, renderHook } from '@testing-library/react-hooks';

const followersSlice = createEntitySlice<TestAppState, UserProfileModel>({
  name: 'Followers',
  selectSliceState: (appState) => appState.Followers,
  selectId: 'username',
  sortComparer: (entityA, entityB) => {
    if (!entityA.username) {
      throw new Error('Missing required property: name');
    }
    if (!entityB.username) {
      throw new Error('Missing required property: name');
    }
    return entityA.username.localeCompare(entityA.username);
  },
});

const userSlice = createModelSlice<TestAppState, UserProfileModel>({
  name: 'User',
  selectSliceState: (appState) => appState.User,
});

describe('Testing Zustand', () => {
  const useStore = create<TestAppState>((set) => ({
    Followers: {
      ...followersSlice.state,
      actions: createStateActions(set, followersSlice.actions),
    },
    User: {
      ...userSlice.state,
      actions: createStateActions(set, userSlice.actions),
    },
  }));
  it('Hydrate Slices', () => {
    const { result: userActions } = renderHook(() => useStore(userSlice.selectors.selectActions));
    const { result: userSliceState } = renderHook(() => useStore(userSlice.selectors.selectSliceState));
    const { result: followerActions } = renderHook(() => useStore(followersSlice.selectors.selectActions));
    const { result: followersSliceState } = renderHook(() => useStore(followersSlice.selectors.selectSliceState));
    act(() => {
      userActions.current.hydrate(PremiumProfile.model);
    });
    expect(userSliceState.current.lastHydrated).toBeTruthy();
    expect(userSliceState.current.lastModified).toBeNull();
    expect(followersSliceState.current.lastModified).toBeNull();
    expect(followersSliceState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.hydrateAll([BasicProfile.model, AdminProfile.model]);
    });
    expect(userSliceState.current.lastHydrated).toBeTruthy();
    expect(userSliceState.current.lastModified).toBeNull();
    expect(followersSliceState.current.lastHydrated).toBeTruthy();
    expect(followersSliceState.current.lastModified).toBeNull();
    act(() => {
      userActions.current.reset();
      followerActions.current.reset();
    });
  });

  it('Update Slices', () => {
    const { result: userActions } = renderHook(() => useStore(userSlice.selectors.selectActions));
    const { result: userSliceState } = renderHook(() => useStore(userSlice.selectors.selectSliceState));
    const { result: followerActions } = renderHook(() => useStore(followersSlice.selectors.selectActions));
    const { result: followersSliceState } = renderHook(() => useStore(followersSlice.selectors.selectSliceState));
    act(() => {
      userActions.current.update(PremiumProfile.model);
    });
    expect(userSliceState.current.lastHydrated).toBeNull();
    expect(userSliceState.current.lastModified).toBeTruthy();
    expect(followersSliceState.current.lastModified).toBeNull();
    expect(followersSliceState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.upsertMany([BasicProfile.model, AdminProfile.model]);
    });
    expect(userSliceState.current.lastHydrated).toBeNull();
    expect(userSliceState.current.lastModified).toBeTruthy();
    expect(followersSliceState.current.lastHydrated).toBeNull();
    expect(followersSliceState.current.lastModified).toBeTruthy();
    act(() => {
      userActions.current.reset();
      followerActions.current.reset();
    });
  });

  it('Set Slices', () => {
    const { result: userActions } = renderHook(() => useStore(userSlice.selectors.selectActions));
    const { result: userSliceState } = renderHook(() => useStore(userSlice.selectors.selectSliceState));
    const { result: followerActions } = renderHook(() => useStore(followersSlice.selectors.selectActions));
    const { result: followersSliceState } = renderHook(() => useStore(followersSlice.selectors.selectSliceState));
    act(() => {
      userActions.current.set(PremiumProfile.model);
    });
    expect(userSliceState.current.lastHydrated).toBeNull();
    expect(userSliceState.current.lastModified).toBeTruthy();
    expect(followersSliceState.current.lastModified).toBeNull();
    expect(followersSliceState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.setAll([BasicProfile.model, AdminProfile.model]);
    });
    expect(userSliceState.current.lastHydrated).toBeNull();
    expect(userSliceState.current.lastModified).toBeTruthy();
    expect(followersSliceState.current.lastHydrated).toBeNull();
    expect(followersSliceState.current.lastModified).toBeTruthy();
    act(() => {
      userActions.current.reset();
      followerActions.current.reset();
    });
  });
});
