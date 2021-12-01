/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import AlertsDuck from '../../fixtures/features/AlertDuck';
import useTestStore, { useTestVanillaStore } from '../../fixtures/store/useTestStore';

describe('Testing Zustand', () => {

  let logger = () => {};
  beforeAll(() => {
    logger = useTestStore.subscribe(console.log, AlertsDuck.selectors.selectSliceState);
  });

  afterAll(() => {
    logger(); // unsub logger
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
    act(() => {
      result.current.reset();
    });
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
    act(() => {
      result.current.reset();
    });
    expect(sliceState.current.lastModified).toBeNull();
    expect(sliceState.current.entities).toMatchObject({});
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
    expect(state.Alerts.lastModified).toBeTruthy();
    Alerts.actions.reset();
    state = useTestVanillaStore.getState();
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
    expect(state.Alerts.lastModified).toBeTruthy();
    Alerts.actions.reset();
    state = useTestVanillaStore.getState();
  });
});

