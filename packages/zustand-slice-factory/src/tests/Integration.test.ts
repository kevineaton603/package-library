/**
 * @jest-environment jsdom
 */
import { AdminProfile, BasicProfile, PremiumProfile } from '../fixtures';
import { act, renderHook } from '@testing-library/react-hooks';
import useTestStore from '../fixtures/store/useTestStore';
import UserProfileDuck from '../fixtures/features/UserProfileDuck';
import FollowersDuck from '../fixtures/features/FollowersDuck';

describe('Testing Zustand', () => {
  it('Hydrate Slices', () => {
    const { result: userActions } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: UserProfileDuckState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
    const { result: followerActions } = renderHook(() => useTestStore(FollowersDuck.selectors.selectActions));
    const { result: FollowersDuckState } = renderHook(() => useTestStore(FollowersDuck.selectors.selectSliceState));
    act(() => {
      userActions.current.hydrate(PremiumProfile.model);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeTruthy();
    expect(UserProfileDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.hydrateAll([BasicProfile.model, AdminProfile.model]);
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
      userActions.current.update(PremiumProfile.model);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeNull();
    expect(UserProfileDuckState.current.lastModified).toBeTruthy();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.upsertMany([BasicProfile.model, AdminProfile.model]);
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
      userActions.current.set(PremiumProfile.model);
    });
    expect(UserProfileDuckState.current.lastHydrated).toBeNull();
    expect(UserProfileDuckState.current.lastModified).toBeTruthy();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    expect(FollowersDuckState.current.lastModified).toBeNull();
    act(() => {
      followerActions.current.setAll([BasicProfile.model, AdminProfile.model]);
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
