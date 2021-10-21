import create from "zustand";
import createVanilla from 'zustand/vanilla';
import createModelSlice, { ModelSliceState } from "./CreateModelSlice";
// import { createSelector } from "reselect";
import { renderHook } from '@testing-library/react-hooks';

type DuckModel = {
    noise: string;
    elevation: number;
}

const slice = createModelSlice<AppState, DuckModel>({
    name: 'Duck',
    selectSliceState: (appState) => appState.Duck
});

const DuckState = {
    ...slice.state,
    actions: slice.actions
};

// const selectDuckBySound = (sound: string) => createSelector(slice.selectors.selectModel, (model) => model.noise === sound);
// const allSelectors = {
//     ...slice.selectors,
//     selectDuckBySound
// }

type DuckSliceState = ModelSliceState<AppState, DuckModel>;

type AppState = {
    Duck: DuckSliceState;
}

describe('Testing Zustand', () => {
    const useStore = create<AppState>(() => ({
        Duck: DuckState,
    }));

    let logger = () => {};
    beforeAll(() => {
        logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
    });

    afterAll(() => {
        logger(); // unsub logger
    })

    it('Test hydrate action', () => {
        renderHook(() => useStore(slice.actions.hydrate({ noise: 'Quack', elevation: 1000})));
        // useStore.setState(slice.actions.hydrate({ noise: 'Quack', elevation: 10000}));
        expect(useStore.getState().Duck.model?.noise).toBe('Quack');
        expect(useStore.getState().Duck.model?.elevation).toBe(10000);
        renderHook(() => useStore(slice.actions.reset()));
        expect(useStore.getState().Duck.lastHydrated).toBe(null);
    })

    it('Test update action', () => {})

    it('Test set action', () => {})
});

describe('Testing Zustand Vanilla', () => {
    const useStore = createVanilla<AppState>(() => ({
        Duck: DuckState,
    }));

    let logger = () => {};
    beforeAll(() => {
        logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
    });

    afterAll(() => {
        logger(); // unsub logger
    })

    it('Test hydrate action', () => {
        useStore.setState(slice.actions.hydrate({ noise: 'Quack', elevation: 10000}));
        expect(useStore.getState().Duck.model?.noise).toBe('Quack');
        expect(useStore.getState().Duck.model?.elevation).toBe(10000);
        useStore.setState(slice.actions.reset());
        expect(useStore.getState().Duck.lastHydrated).toBe(null);
    })

    it('Test update action', () => {})

    it('Test set action', () => {})
})
