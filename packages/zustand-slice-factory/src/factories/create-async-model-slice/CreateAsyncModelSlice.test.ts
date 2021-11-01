/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { PremiumProfile } from '../../fixtures';
import useTestStore from '../../fixtures/store/useTestStore';
import UserProfileDuck from '../../fixtures/features/UserProfileDuck';

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
    const { result } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
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
    const { result } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(UserProfileDuck.selectors.selectSliceState));
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
