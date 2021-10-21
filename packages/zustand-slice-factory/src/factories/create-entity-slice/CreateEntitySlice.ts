import { createSelector } from "reselect";
import EntityState, { EntityStateType } from "../../models/entity-state";
import { Comparer, EntityId, EntitySliceActions, EntitySliceSelectors } from "../../types";
import { createRecordFromArray } from "../../utils";

type EntitySliceOptions<TAppState extends object, TModel extends object> = {
    name: keyof TAppState;
    selectSliceState: (appState: TAppState) => EntityStateType<TAppState, TModel>;
    selectId: (model: TModel) => EntityId | keyof TModel;
    sortComparer: false | Comparer<TModel>;
    initialState?: Partial<EntityStateType<TAppState, TModel>>;
}

export type EntitySliceState<TAppState extends object, TModel extends object, TSliceActions extends EntitySliceActions<TAppState, TModel> = EntitySliceActions<TAppState, TModel>> = EntityStateType<TAppState, TModel> & {
    actions: TSliceActions
}

export type EntitySlice<TAppState extends object, TModel extends object> = {
    name: keyof TAppState;
    actions: EntitySliceActions<TAppState, TModel>;
    selectors: EntitySliceSelectors<TAppState, TModel>;
    state: EntityStateType<TAppState, TModel>;
}

const createEntitySlice = <TAppState extends object, TEntity extends object>(options: EntitySliceOptions<TAppState, TEntity>) : EntitySlice<TAppState, TEntity>  => {

    const selectors: EntitySliceSelectors<TAppState, TEntity> = {
        selectSliceState: createSelector(options.selectSliceState, (model) => model),
        selectEntities: createSelector(options.selectSliceState, (model) => model.entities),
        selectIds: createSelector(options.selectSliceState, (model) => model.ids),
        selectTotal: createSelector(options.selectSliceState, (model) => model.ids.length),
        selectAll: createSelector(options.selectSliceState, (model) => Object.values(model.entities)),
        selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
        selectLastHydrated: createSelector(options.selectSliceState, (model) => model.lastHydrated),
        selectById: (id: EntityId) => createSelector(options.selectSliceState, (model) => model.entities?.[id])
    }

    const actions: EntitySliceActions<TAppState, TEntity> = {
        addMany: (_models) => (state: TAppState) => ({...state, [options.name]: {}}),
        addOne: (_models) => (state: TAppState) => ({...state, [options.name]: {}}),
        hydrateAll: (models) => (state: TAppState) => ({...state, [options.name]: {
            ...state[options.name],
            ids: models?.map(options.selectId),
            entities: createRecordFromArray(models ?? [], options.selectId)
        }}),
        hydrateMany: (_models) => (state: TAppState) => ({...state, [options.name]: {}}),
        hydrateOne: (_models) => (state: TAppState) => ({...state, [options.name]: {}}),
        removeAll: () => (state: TAppState) => ({...state, [options.name]: {
            ...state[options.name],
            ids: [],
            entities: []
        }}),
        removeMany: (_models) => (state: TAppState) => ({...state, [options.name]: {}}),
        removeOne: (_models) => (state: TAppState) => ({...state, [options.name]: {}}),
        reset: () => (state: TAppState) => ({...state, [options.name]: initialState}),
        setAll: (models) => (state: TAppState) => ({...state, [options.name]: {
            ...state[options.name],
            ids: models?.map(options.selectId),
            entities: createRecordFromArray(models ?? [], options.selectId)
        }}),
        // updateMany,
        // updateOne,
        upsertMany: (_models) => (state: TAppState) => ({...state, [options.name]: {}}),
        upsertOne: (_models) => (state: TAppState) => ({...state, [options.name]: {}}),
    }

    const initialState = EntityState.create<TAppState, TEntity>({
        ...options?.initialState,
        actions: actions
    });

    return({
        name: options.name,
        selectors: selectors,
        actions: actions,
        state: initialState
    });
}

export default createEntitySlice;
