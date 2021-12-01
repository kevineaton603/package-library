# zustand-slice-factory 🐻🍕🏭

> A light-weight package with generic factory functions for common slice data structures

> Inspired by [redux-slice-factory 🍕🏭](https://github.com/gregjoeval/package-library/tree/master/packages/redux-slice-factory)

![version](https://badgen.net/npm/v/zustand-slice-factory) ![types](https://badgen.net/npm/types/zustand-slice-factory) ![types](https://badgen.net/packagephobia/install/zustand-slice-factory) ![types](https://badgen.net/packagephobia/publish/zustand-slice-factory) ![types](https://badgen.net/badge/license/MIT/blue)

## Install 💾
```shell
npm install zustand-slice-factory
```

## What's the goal? 🏆
This package will
- provide a more opinionated zustand experience
- provide build-in support for async workflow
- save you time & effort

## What's a Slice? 🍕

A slice is a bundle of everything associated to a piece of zustand state `{ name, selectors, state, actions }`

the `name` is the domain the slice is responsible for
the `selectors` exposes functions to read data for state
the `state` is the initial state used in the `create` method from zustand
the `action` actions to be store along with state

## Why use Slices?
[Read this if you want to learn more](https://github.com/pmndrs/zustand/wiki/Splitting-the-store-into-separate-slices)

## What's Included?
- `createModelSlice()` create a slice for a single synchronous model 
- `createEntitySlice()` create a slice for a collection of synchronous entities
- `createAsyncModelSlice()` create a slice for a single asynchronous model with request information
- `createAsyncEntitySlice()` create a slice for a collection of asynchronous entities with request information
## Why differentiate between async/sync slices?

- Not every slice needs to track request information (i.e. UI data like Menus, Alert etc.)
- Reduce amount of unused information in the store
- SyncSlice can be easily extends into AsyncSlice if need be.

## Show Me the Code...

### Zustand (with Hooks)

```tsx

type UserProfileSliceActions = AsyncModelSliceStateActions<UserProfileModel> & {
  get: Action<[string], Promise<void>>;
};

type UserProfileModelState = AsyncModelSliceState<UserProfileModel, Error, UserProfileSliceActions>;

const slice = createAsyncModelSlice<AppState, UserProfileModel, Error, UserProfileSliceActions>({
  name: 'UserProfile',
  selectSliceState: (appState) => appState.UserProfile,
});

// Create your own actions
const get: SetAction<AppState, [string], Promise<void>> = (set) => async (id) => {
  slice.actions.setStatus(set)(StatusEnum.Requesting);
  slice.actions.setError(set)(null);
  try {
    const response = await getUser(id); 
    slice.actions.hydrate(set)(response);
    slice.actions.setStatus(set)(StatusEnum.Settled);
  } catch (error) {
    slice.actions.setStatus(set)(StatusEnum.Failed);
    slice.actions.setError(set)(error as Error);
  }
};

const allActions = {
  ...slice.actions,
  get,
};

// Create final slice state that will be saved to the store
const createUserProfileSlice = (set: SetState<AppState>) => createAsyncModelSliceState<AppState, UserProfileModel, Error, UserProfileSliceActions>(
  set,
  slice.state,
  allActions
);

const UserProfileDuck = {
  create: createUserProfileSlice,
  name: slice.name,
  selectors: slice.selectors,
};

type AppState = {
  UserProfile: AsyncModelSliceState<UserProfileModel, Error, UserProfileSliceActions>
};

const useStore = create<AppState>((set) => ({
  UserProfile: UserProfileDuck.create(set),
}));

const UserProfile: React.FC = () => {
   const userActions = useStore(slice.selectors.selectActions);
   const userModelState = useStore(slice.selectors.selectStateSlice);

   useEffect(() => {
      userActions.set({
         username: 'kevin.saco.eaton@gmail.edu',
         url: 'https://github.com/kevineaton603',
         roles: [UserRoleEnum.Premium],
      })
   }, [])
   return(<div>{userModelState.model.username}</div>)
}

```

### Zustand Vanilla (without Hooks)

```ts
...

const useStore = create<AppState>((set) => ({
  UserProfile: UserProfileDuck.create(set),
}));

const { UserProfile } = store.getState();
UserProfile.actions.set({
   username: 'kevin.saco.eaton@gmail.edu',
   url: 'https://github.com/kevineaton603',
   roles: [UserRoleEnum.Premium],
});
```