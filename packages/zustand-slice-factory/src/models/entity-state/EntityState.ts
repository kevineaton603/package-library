import { EntityId, EntitySliceActions } from '../../types';
import MetaState, { MetaStateType } from '../meta-state';

export type EntityStateType<TAppState extends object, TEntity extends object, TActions extends EntitySliceActions<TAppState, TEntity> = EntitySliceActions<TAppState, TEntity>> = MetaStateType & {
  ids: EntityId[];
  entities: Record<EntityId, TEntity>;
  actions: TActions
};

const create = <TAppState extends object, TModel extends object>(args?: Partial<EntityStateType<TAppState, TModel>>): EntityStateType<TAppState, TModel> => {
  if (!args?.actions) {
    throw new Error('Missing Required Property: actions');
  }
  return ({
    ...MetaState.create(args),
    ids: args?.ids ?? [],
    entities: args?.entities ?? {},
    actions: args?.actions, 
  });
};

const EntityState = {
  create: create,
};

export default EntityState;
