import { MetaStateType } from '../../models/meta-state';

type SliceAdapterAction<
    TArguments extends any[] = undefined[],
    TSliceState extends MetaStateType = MetaStateType,
> = (state: TSliceState, ...args: TArguments) => TSliceState;

const createSliceAdapter = () => {
  const setLastModified: SliceAdapterAction<[string | null]> = (state, lastModified) => {
    state.lastModified = lastModified;
    return state;
  };
  const setLastHydrated: SliceAdapterAction<[string | null]> = (state, lastHydrated) => {
    state.lastHydrated = lastHydrated;
    return state;
  };
  return ({
    setLastModified: setLastModified,
    setLastHydrated: setLastHydrated,
  });
};

export default createSliceAdapter;
