/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import useTestStore from '../fixtures/store/useTestStore';
import UserProfileDuck from '../fixtures/features/UserProfileDuck';
import FollowersDuck from '../fixtures/features/FollowersDuck';
import { AdminProfile, BasicProfile, PremiumProfile } from '../fixtures/models/UserProfile';

describe('Testing Zustand', () => {
  it('Hydrate Slices', () => {
    const { result: userActions } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: UserProfileDuckState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
    const { result: followerActions } = renderHook(() => useTestStore(FollowersDuck.selectors.selectActions));
    const { result: FollowersDuckState } = renderHook(() => useTestStore(FollowersDuck.selectors.selectSliceState));
    act(() => {
      userActions.current.hydrate(PremiumProfile);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeTruthy();
    expect(UserProfileDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.hydrateAll([BasicProfile, AdminProfile]);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeTruthy();
    expect(UserProfileDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastHydrated).toBeTruthy();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    act(() => {
      userActions.current.reset();
      followerActions.current.reset();
    });
  });

  it('Update Slices', () => {
    const { result: userActions } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: UserProfileDuckState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
    const { result: followerActions } = renderHook(() => useTestStore(FollowersDuck.selectors.selectActions));
    const { result: FollowersDuckState } = renderHook(() => useTestStore(FollowersDuck.selectors.selectSliceState));
    act(() => {
      userActions.current.update(PremiumProfile);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeNull();
    expect(UserProfileDuckState.current.lastModified).toBeTruthy();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.upsertMany([BasicProfile, AdminProfile]);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeNull();
    expect(UserProfileDuckState.current.lastModified).toBeTruthy();
    expect(FollowersDuckState.current.lastHydrated).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeTruthy();
    act(() => {
      userActions.current.reset();
      followerActions.current.reset();
    });
  });

  it('Set Slices', () => {
    const { result: userActions } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: UserProfileDuckState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
    const { result: followerActions } = renderHook(() => useTestStore(FollowersDuck.selectors.selectActions));
    const { result: FollowersDuckState } = renderHook(() => useTestStore(FollowersDuck.selectors.selectSliceState));
    act(() => {
      userActions.current.set(PremiumProfile);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeNull();
    expect(UserProfileDuckState.current.lastModified).toBeTruthy();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.setAll([BasicProfile, AdminProfile]);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeNull();
    expect(UserProfileDuckState.current.lastModified).toBeTruthy();
    expect(FollowersDuckState.current.lastHydrated).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeTruthy();
    act(() => {
      userActions.current.reset();
      followerActions.current.reset();
    });
  });
});
