import { EntityId } from '../../types';
import MetaState, { MetaStateType } from '../meta-state';

export type EntityStateType<TEntity extends object> = MetaStateType & {
  ids: EntityId[];
  entities: Record<EntityId, TEntity>;
};

const create = <TModel extends object>(args?: Partial<EntityStateType<TModel>>): EntityStateType<TModel> => {
  return ({
    ...MetaState.create(args),
    ids: args?.ids ?? [],
    entities: args?.entities ?? {},
  });
};

const EntityState = {
  create: create,
};

export default EntityState;
