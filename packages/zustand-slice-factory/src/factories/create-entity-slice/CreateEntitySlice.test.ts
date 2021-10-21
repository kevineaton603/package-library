import create from "zustand";
import createVanilla from 'zustand/vanilla';
import createEntitySlice, { EntitySliceState } from "./CreateEntitySlice";

type AnimalModel = {
    name: string;
    noise: string;
}

const slice = createEntitySlice<AppState, AnimalModel>({
    name: 'Animal',
    selectSliceState: (appState) => appState.Animal,
    selectId: (entity) => {
        if(!entity.name) {
            throw new Error('Missing required property: name')
        }
        return entity.name;
    },
    sortComparer: (entityA, entityB) => {
        if (!entityA.name) {
            throw new Error('Missing required property: name');
        }
        if (!entityB.name) {
            throw new Error('Missing required property: name');
        }
        return entityA.name.localeCompare(entityA.name);
    }
});

const AnimalState = {
    ...slice.state,
    actions: slice.actions
}

type AnimalSliceState = EntitySliceState<AppState, AnimalModel>;

type AppState = {
    Animal: AnimalSliceState;
}

describe('Testing Zustand', () => {
    const useStore = create<AppState>(() => ({
        Animal: AnimalState,
    }));

    let logger = () => {};
    beforeAll(() => {
        logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
    });

    afterAll(() => {
        logger(); // unsub logger
    });

    it('Test hydrate action', () => {
        const unsubscribe = useStore.subscribe(console.log, slice.selectors.selectSliceState);
        useStore.setState(slice.actions.hydrateAll([
            {
                name: 'Duck',
                noise: 'Quack'
            },
            {
                name: 'Cow',
                noise: 'Moo'
            }
        ]));
        expect(useStore.getState().Animal.entities?.['Duck']?.noise).toBe('Quack');
        expect(useStore.getState().Animal.entities?.['Duck']?.name).toBe('Duck');
        useStore.setState(slice.actions.reset());
        expect(useStore.getState().Animal.lastHydrated).toBe(null);
        unsubscribe();
    })

    it('Test update action', () => {})

    it('Test set action', () => {})
})

describe('Testing Zustand Vanilla', () => {
    const useStore = createVanilla<AppState>(() => ({
        Animal: AnimalState,
    }));

    let logger = () => {};
    beforeAll(() => {
        logger = useStore.subscribe(console.log, slice.selectors.selectSliceState);
    });

    afterAll(() => {
        logger(); // unsub logger
    })
    it('Test hydrate action', () => {
        const unsubscribe = useStore.subscribe(console.log, slice.selectors.selectSliceState);
        useStore.setState(slice.actions.hydrateAll([
            {
                name: 'Duck',
                noise: 'Quack'
            },
            {
                name: 'Cow',
                noise: 'Moo'
            }
        ]));
        expect(useStore.getState().Animal.entities?.['Duck']?.noise).toBe('Quack');
        expect(useStore.getState().Animal.entities?.['Duck']?.name).toBe('Duck');
        useStore.setState(slice.actions.reset());
        expect(useStore.getState().Animal.lastHydrated).toBe(null);
        unsubscribe();
    })

    it('Test update action', () => {})

    it('Test set action', () => {})
})

