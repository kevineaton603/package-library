/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import useTestStore, { useTestVanillaStore } from '../../fixtures/store/useTestStore';
import MenuDuck from '../../fixtures/features/MenuDuck';
import { PremiumProfile } from '../../fixtures/models/UserProfile';

describe('Testing Zustand', () => {
  const logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test update action', () => {
    const { result } = renderHook(() => useTestStore(MenuDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(MenuDuck.selectors.selectSliceState));
    act(() => {
      result.current.update({ open: true });
    });
    
    expect(sliceState.current.model?.open).toBe(true);
    expect(sliceState.current.lastModified).toBeTruthy();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.model?.open).toBe(false);
  });

  it('Test set action', () => {
    const { result } = renderHook(() => useTestStore(MenuDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(MenuDuck.selectors.selectSliceState));
    act(() => {
      result.current.set({ open: true });
    });
    
    expect(sliceState.current.model?.open).toBe(true);
    expect(sliceState.current.lastModified).toBeTruthy();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.model?.open).toBe(false);
  });
});

describe('Testing Zustand Vanilla', () => {
  const store = useTestVanillaStore;

  const logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test update action', () => {
    const { UserProfile } = store.getState();
    UserProfile.actions.update(PremiumProfile);
    
    expect(store.getState().UserProfile.model?.username).toBe(PremiumProfile.username);
    expect(store.getState().UserProfile.model?.url).toBe(PremiumProfile.url);
    UserProfile.actions.reset();
    expect(store.getState().UserProfile.lastModified).toBe(null);
  });

  it('Test set action', () => {
    const { UserProfile } = store.getState();
    UserProfile.actions.set(PremiumProfile);
    
    expect(store.getState().UserProfile.model?.username).toBe(PremiumProfile.username);
    expect(store.getState().UserProfile.model?.url).toBe(PremiumProfile.url);
    UserProfile.actions.reset();
    expect(store.getState().UserProfile.lastModified).toBe(null);
  });
});
