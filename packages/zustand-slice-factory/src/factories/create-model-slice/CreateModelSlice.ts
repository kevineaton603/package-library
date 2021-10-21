import { createSelector } from "reselect";
import ModelState, { ModelStateType } from "../../models/model-state";
import { ModelSliceActions, ModelSliceSelectors } from "../../types";

export type ModelSliceState<TAppState extends object, TModel extends object, TSliceActions extends ModelSliceActions<TAppState, TModel> = ModelSliceActions<TAppState, TModel>> = ModelStateType<TModel> & {
    actions: TSliceActions
}

export type ModelSlice<TAppState extends object, TModel extends object> = {
    name: keyof TAppState;
    actions: ModelSliceActions<TAppState, TModel>;
    selectors: ModelSliceSelectors<TAppState, TModel>;
    state: ModelStateType<TModel>;
}

const createModelSlice = <TAppState extends object, TModel extends object>(options: {
    name: keyof TAppState;
    selectSliceState: (appState: TAppState) => ModelStateType<TModel>
    initialState?: Partial<ModelStateType<TModel>>
}): ModelSlice<TAppState, TModel> => {

    const initialState = ModelState.create(options?.initialState);

    const selectors = {
        selectSliceState: createSelector(options.selectSliceState, (model) => model),
        selectModel: createSelector(options.selectSliceState, (model) => model.model),
        selectLastModified: createSelector(options.selectSliceState, (model) => model.lastModified),
        selectLastHydrated: createSelector(options.selectSliceState, (model) => model.lastHydrated)
    }

    const actions: ModelSliceActions<TAppState, TModel> = {
        reset: () => (state: TAppState) => ({...state, [options.name]: {...state[options.name], ...initialState}}),
        hydrate: (model) => (state: TAppState) => ({...state, [options.name]: {...state[options.name], model: model}}),
        update: (model) => (state: TAppState) => ({...state, [options.name]: {...state[options.name], model: model}}),
        set: (model) => (state: TAppState) => ({...state, [options.name]: {...state[options.name], model: model}})
    }

    return {
        name: options.name,
        actions: actions,
        selectors: selectors,
        state: initialState
    }
}

export default createModelSlice;

