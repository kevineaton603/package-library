import AsyncMetaState, { AsyncMetaStateType } from '../async-meta-state';
import EntityState, { EntityStateType } from '../entity-state';

export type AsyncEntityStateType<TModel extends object, TError extends Error = Error> = AsyncMetaStateType<TError> & EntityStateType<TModel>;

const create = <TModel extends object, TError extends Error = Error>(args?: Partial<AsyncEntityStateType<TModel, TError>>): AsyncEntityStateType<TModel, TError> => ({
  ...EntityState.create(args) as EntityStateType<TModel>,
  ...AsyncMetaState.create(args) as AsyncMetaStateType<TError>,
});

const AsyncEntityState = {
  create: create,
};

export default AsyncEntityState;
