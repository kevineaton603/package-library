/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import useTestStore from '../../fixtures/store/useTestStore';
import UserProfileDuck from '../../fixtures/features/UserProfileDuck';
import { PremiumProfile } from '../../fixtures/models/UserProfile';

describe('Testing Zustand', () => {
  
  const logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });
  
  afterAll(() => {
    logger(); // unsub logger
  });
  
  it('Test hydrate action', () => {
    const { result } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
    act(() => {
      result.current.hydrate(PremiumProfile);
    });
      
    expect(sliceState.current.model?.username).toBe(PremiumProfile.username);
    expect(sliceState.current.model?.url).toBe(PremiumProfile.url);
    expect(sliceState.current.lastHydrated).toBeTruthy();
    expect(sliceState.current.lastModified).toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
  });
  
  it('Test update action', () => {
    const { result } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
    act(() => {
      result.current.update(PremiumProfile);
    });
      
    expect(sliceState.current.model?.username).toBe(PremiumProfile.username);
    expect(sliceState.current.model?.url).toBe(PremiumProfile.url);
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeTruthy();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
  });
  
  it('Test set action', () => {
    const { result } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
    act(() => {
      result.current.set(PremiumProfile);
    });
      
    expect(sliceState.current.model?.username).toBe(PremiumProfile.username);
    expect(sliceState.current.model?.url).toBe(PremiumProfile.url);
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeTruthy();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
  });
});
