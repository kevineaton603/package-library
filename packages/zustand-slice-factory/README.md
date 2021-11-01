# zustand-slice-factory 🐻🍕🏭

> A light-weight package with generic factory functions for common slice data structures

> Inspired by [redux-slice-factory 🍕🏭](https://github.com/gregjoeval/package-library/tree/master/packages/redux-slice-factory)

## Install 💾
```shell
npm install zustand-slice-factory
```

## What's the goal? 🏆
This package will
- reduce boilerplate
- prevent duplicate code
- save you time & effort

## What's a Slice?

A slice is a bundle of everything associated to a piece of zustand state `{ name, selectors, actions, state }`

the `name` is the domain the slice is responsible for
the `selectors` exposes functions to read data for state

## Why use Slices?
[Read this if you want to learn more](https://github.com/pmndrs/zustand/wiki/Splitting-the-store-into-separate-slices)

## What's Included?
- `createModelSlice()` create a slice for a single synchronous model 
- `createEntitySlice()` create a slice for a collection of synchronous entities
- `createAsyncModelSlice()` create a slice for a single asynchronous model 
- `createAsyncEntitySlice()` create a slice for a collection of asynchronous entities
## Why differentiate between async/sync slices?

- Not every slice needs to track request information (i.e. UI data like Menus, Alert etc.)
- Reduce amount of unused information in the store
- SyncSlice can be easily extends into AsyncSlice if need be.

## Show Me the Code...

### Zustand (with Hooks)

```tsx
type AppState = {
  User: AsyncModelSliceState<UserProfileModel>;
};

const slice = createAsyncModelSlice<AppState, UserProfileModel, Error>({
  name: 'User',
  selectSliceState: (appState) => appState.User,
});

const useStore = create<AppState>((set) => ({
   User: {
   ...slice.state,
   // Helper Methods to Inject SetState into actions stored in state. 
   actions: createStateActions<AppState, AsyncModelSliceStateActions<UserProfileModel>, AsyncModelSliceSetActions<AppState, UserProfileModel>>(set, slice.actions),
   },
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
type AppState = {
  User: AsyncModelSliceState<UserProfileModel>;
};

const slice = createAsyncModelSlice<AppState, UserProfileModel, Error>({
  name: 'User',
  selectSliceState: (appState) => appState.User,
});

const useStore = create<AppState>((set) => ({
   User: {
   ...slice.state,
   // Helper Methods to Inject SetState into actions stored in state. 
   actions: createStateActions<AppState, AsyncModelSliceStateActions<UserProfileModel>, AsyncModelSliceSetActions<AppState, UserProfileModel>>(set, slice.actions),
   },
}));
```