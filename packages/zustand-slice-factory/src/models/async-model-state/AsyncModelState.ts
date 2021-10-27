import AsyncMetaState, { AsyncMetaStateType } from '../async-meta-state';
import ModelState, { ModelStateType } from '../model-state';

export type AsyncModelStateType<TModel extends object, TError extends Error = Error> = AsyncMetaStateType<TError> & ModelStateType<TModel>;

const create = <TModel extends object, TError extends Error = Error>(args?: Partial<AsyncModelStateType<TModel, TError>>): AsyncModelStateType<TModel, TError> => ({
  ...ModelState.create(args) as ModelStateType<TModel>,
  ...AsyncMetaState.create(args) as AsyncMetaStateType<TError>,
});

const AsyncModelState = {
  create: create,
};

export default AsyncModelState;
