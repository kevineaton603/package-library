/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react-hooks';
import { AdminProfile, BasicProfile, PremiumProfile, UserProfileModel } from '../../fixtures/models/UserProfile';
import useTestStore from '../../fixtures/store/useTestStore';
import createEntityAdapter from './CreateEntityAdapter';

describe('Testing EntityAdapter', () => {
  const { result } = renderHook(() => useTestStore());
  it('Use SelectIdMethod', () => {
    const adapter = createEntityAdapter<UserProfileModel>({
      selectId: (model) => model.username,
      sortComparer: (modelA, modelB) => modelA.username.localeCompare(modelB.username),
    });

    act(() => {
      const newSliceState = adapter.setAll(result.current.Followers, [AdminProfile, BasicProfile, PremiumProfile]);
      expect(newSliceState.ids.length).toBe(3);
    });

  });

  it('Use SelectIdKey', () => {
    const adapter = createEntityAdapter<UserProfileModel>({
      selectId: 'username',
      sortComparer: (modelA, modelB) => modelA.username.localeCompare(modelB.username),
    });
    act(() => {
      const newSliceState = adapter.setAll(result.current.Followers, [AdminProfile, BasicProfile, PremiumProfile]);
      expect(newSliceState.ids.length).toBe(3);
    });
  });
});
