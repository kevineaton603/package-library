/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import AlertsDuck from '../../fixtures/features/AlertDuck';
import useTestStore, { useTestVanillaStore } from '../../fixtures/store/useTestStore';

describe('Testing Zustand', () => {

  let logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });

  it('Test hydrateAll action', () => {
    const { result } = renderHook(() => useTestStore(AlertsDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(AlertsDuck.selectors.selectSliceState));
    act(() => {
      result.current.hydrateAll([
        {
          id: '1',
          message: 'Success',
          open: true,
          severity: 'success',
        },
        {
          id: '2',
          message: 'Warning',
          open: true,
          severity: 'warning',
        },
        {
          id: '3',
          message: 'Error',
          open: true,
          severity: 'error',
        },
      ]);
    });

    expect(sliceState.current.entities?.['1'].message).toBe('Success');
    expect(sliceState.current.entities?.['1']?.open).toBe(true);
    expect(sliceState.current.lastHydrated).toBeTruthy();
    expect(sliceState.current.lastModified).toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeNull();
  });

  it('Test updateMany action', () => {
    const { result } = renderHook(() => useTestStore(AlertsDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(AlertsDuck.selectors.selectSliceState));
    act(() => {
      result.current.upsertMany([
        {
          id: '1',
          message: 'Success',
          open: true,
          severity: 'success',
        },
        {
          id: '2',
          message: 'Warning',
          open: true,
          severity: 'warning',
        },
        {
          id: '3',
          message: 'Error',
          open: true,
          severity: 'error',
        },
      ]);
    });

    expect(sliceState.current.entities?.['1'].message).toBe('Success');
    expect(sliceState.current.entities?.['1']?.open).toBe(true);
    expect(sliceState.current.lastModified).toBeTruthy();
    expect(sliceState.current.lastHydrated).toBeNull();
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastHydrated).toBeNull();
    expect(sliceState.current.lastModified).toBeNull();
  });

  it('Test setAll action', () => {
    const { result } = renderHook(() => useTestStore(AlertsDuck.selectors.selectActions));
    const { result: sliceState } = renderHook(() => useTestStore(AlertsDuck.selectors.selectSliceState));
    act(() => {
      result.current.setAll([
        {
          id: '1',
          message: 'Success',
          open: true,
          severity: 'success',
        },
        {
          id: '2',
          message: 'Warning',
          open: true,
          severity: 'warning',
        },
        {
          id: '3',
          message: 'Error',
          open: true,
          severity: 'error',
        },
      ]);
    });

    expect(sliceState.current.entities?.['1'].message).toBe('Success');
    expect(sliceState.current.entities?.['1']?.open).toBe(true);
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

  let logger = () => {};
  beforeAll(() => {
    // logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
  });
  it('Test hydrateAll action', () => {
    const { Alerts } = useTestVanillaStore.getState();
    Alerts.actions.hydrateAll([
      {
        id: '1',
        message: 'Success',
        open: true,
        severity: 'success',
      },
      {
        id: '2',
        message: 'Warning',
        open: true,
        severity: 'warning',
      },
      {
        id: '3',
        message: 'Error',
        open: true,
        severity: 'error',
      },
    ]);
    expect(useTestVanillaStore.getState().Alerts.entities?.['1'].message).toBe('Success');
    expect(useTestVanillaStore.getState().Alerts.entities?.['1']?.open).toBe(true);
    Alerts.actions.reset();
    expect(useTestVanillaStore.getState().Alerts.lastHydrated).toBeNull();
  });

  it('Test upsertMany action', () => {
    const { Alerts } = useTestVanillaStore.getState();
    Alerts.actions.upsertMany([
      {
        id: '1',
        message: 'Success',
        open: true,
        severity: 'success',
      },
      {
        id: '2',
        message: 'Warning',
        open: true,
        severity: 'warning',
      },
      {
        id: '3',
        message: 'Error',
        open: true,
        severity: 'error',
      },
    ]);
    let state = useTestVanillaStore.getState();
    expect(state.Alerts.entities?.['1'].message).toBe('Success');
    expect(state.Alerts.entities?.['1']?.open).toBe(true);
    expect(state.Alerts.lastHydrated).toBeFalsy();
    expect(state.Alerts.lastModified).toBeTruthy();
    Alerts.actions.reset();
    state = useTestVanillaStore.getState();
    expect(state.Alerts.lastHydrated).toBeNull();
  });

  it('Test setAll action', () => {
    const { Alerts } = useTestVanillaStore.getState();
    Alerts.actions.setAll([
      {
        id: '1',
        message: 'Success',
        open: true,
        severity: 'success',
      },
      {
        id: '2',
        message: 'Warning',
        open: true,
        severity: 'warning',
      },
      {
        id: '3',
        message: 'Error',
        open: true,
        severity: 'error',
      },
    ]);
    let state = useTestVanillaStore.getState();
    expect(state.Alerts.entities?.['1'].message).toBe('Success');
    expect(state.Alerts.entities?.['1']?.open).toBe(true);
    expect(state.Alerts.lastHydrated).toBeFalsy();
    expect(state.Alerts.lastModified).toBeTruthy();
    Alerts.actions.reset();
    state = useTestVanillaStore.getState();
    expect(useTestVanillaStore.getState().Alerts.lastHydrated).toBeNull();
  });
});

