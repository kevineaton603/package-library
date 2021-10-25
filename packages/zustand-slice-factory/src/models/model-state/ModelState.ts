import MetaState, { MetaStateType } from '../meta-state';

export type ModelStateType<TModel extends object> = MetaStateType & {
  model: TModel;
};

const create = <TModel extends object>(args?: Partial<ModelStateType<TModel>>): ModelStateType<TModel> => ({
  ...MetaState.create(args),
  model: args?.model ?? {} as TModel,
});

const ModelState = {
  create,
};

export default ModelState;
