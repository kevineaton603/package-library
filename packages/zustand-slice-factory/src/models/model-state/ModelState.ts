import { MetaState } from "../meta-state";

export type ModelStateType<TModel extends object> = MetaState & {
    model: TModel;
}

const create = <TModel extends object>(args?: Partial<ModelStateType<TModel>>): ModelStateType<TModel> => {
    return ({
        lastHydrated: args?.lastHydrated ?? null,
        lastModified: args?.lastModified ?? null,
        model: args?.model ?? {} as TModel
    });
};

const ModelState = {
    create: create
}

export default ModelState;
