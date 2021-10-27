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
      addMany: () => {},
      addOne: () => {},
      hydrateAll: () => {},
      hydrateMany: () => {},
      hydrateOne: () => {},
      removeAll: () => {},
      removeMany: () => {},
      removeOne: () => {},
      reset: () => {},
      setAll: () => {},
      upsertMany: () => {},
      upsertOne: () => {},
    },
  },
};

describe('Testing EntityAdapter', () => {
  it('Use SelectIdMethod', () => {
    const adapter = createEntityAdapter<UserProfileModel>({
      selectId: (model) => model.username,
      sortComparer: (modelA, modelB) => modelA.username.localeCompare(modelB.username),
    });

    const newSliceState = adapter.setAll(state.Followers, [AdminProfile.model, BasicProfile.model, PremiumProfile.model]);

    expect(newSliceState.ids.length).toBe(3);

  });

  it('Use SelectIdKey', () => {
    const adapter = createEntityAdapter<UserProfileModel>({
      selectId: 'username',
      sortComparer: (modelA, modelB) => modelA.username.localeCompare(modelB.username),
    });

    const newSliceState = adapter.setAll(state.Followers, [AdminProfile.model, BasicProfile.model, PremiumProfile.model]);

    expect(newSliceState.ids.length).toBe(3);
  });
});
