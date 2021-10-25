import { AdminProfile, BasicProfile, PremiumProfile, TestAppState, UserProfileModel } from '../../fixtures';
import { createRecordFromArray } from '../../utils';
import createEntityAdapter from './CreateEntityAdapter';

const state: TestAppState = {
  User: PremiumProfile,
  Followers: {
    ids: [AdminProfile.model.username, BasicProfile.model.username],
    entities: createRecordFromArray([AdminProfile.model, BasicProfile.model], (model) => model.username),
    lastHydrated: null,
    lastModified: null,
    actions: {
      addMany: () => (appState) => appState,
      addOne: () => (appState) => appState,
      hydrateAll: () => (appState) => appState,
      hydrateMany: () => (appState) => appState,
      hydrateOne: () => (appState) => appState,
      removeAll: () => (appState) => appState,
      removeMany: () => (appState) => appState,
      removeOne: () => (appState) => appState,
      reset: () => (appState) => appState,
      setAll: () => (appState) => appState,
      upsertMany: () => (appState) => appState,
      upsertOne: () => (appState) => appState,
    },
  },
};

describe('Testing EntityAdapter', () => {
  it('Use SelectIdMethod', () => {
    const adapter = createEntityAdapter<TestAppState, UserProfileModel>({
      selectId: (model) => model.username,
      sortComparer: (modelA, modelB) => modelA.username.localeCompare(modelB.username),
    });

    const newSliceState = adapter.setAll(state.Followers, [AdminProfile.model, BasicProfile.model, PremiumProfile.model]);

    expect(newSliceState.ids.length).toBe(3);

  });

  it('Use SelectIdKey', () => {
    const adapter = createEntityAdapter<TestAppState, UserProfileModel>({
      selectId: 'username',
      sortComparer: (modelA, modelB) => modelA.username.localeCompare(modelB.username),
    });

    const newSliceState = adapter.setAll(state.Followers, [AdminProfile.model, BasicProfile.model, PremiumProfile.model]);

    expect(newSliceState.ids.length).toBe(3);
  });
});