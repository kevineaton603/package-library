import { EntitySliceState } from '../../factories/create-entity-slice/CreateEntitySlice';
import { Comparer, EntityId, SelectIdMethod } from '../../types';

export type Update<TEntity extends object> = {
  id: EntityId;
  changes: Partial<TEntity>;
};

const createDefaultSelectId = <TEntity extends object>(key: keyof TEntity): SelectIdMethod<TEntity> => (entity: TEntity) => {
  const value = entity[key];
  if (!value) {
    throw new Error(`Missing required property: ${key}`);
  }
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`property: ${key} is not of type string or number`);
  }
  return value;
};

type EntityAdapterProps<TEntity extends object> = {
  selectId: SelectIdMethod<TEntity> | keyof TEntity;
  sortComparer: Comparer<TEntity>;
};

type EntityAdapterAction<
    TEntity extends object,
    TArguments extends any[] = undefined[],
    TSliceState extends EntitySliceState<TEntity> = EntitySliceState<TEntity>> = (state: TSliceState, ...args: TArguments) => TSliceState;

export type EntitySliceActions<TEntity extends object, TSliceState extends EntitySliceState<TEntity>> = {
  addOne: EntityAdapterAction<TEntity, [TEntity], TSliceState>;
  addMany: EntityAdapterAction<TEntity, [TEntity[]], TSliceState>;
  updateOne: EntityAdapterAction<TEntity, [Update<TEntity>], TSliceState>;
  updateMany: EntityAdapterAction<TEntity, [Update<TEntity>[]], TSliceState>;
  upsertOne: EntityAdapterAction<TEntity, [TEntity], TSliceState>;
  upsertMany: EntityAdapterAction<TEntity, [TEntity[]], TSliceState>;
  removeOne: EntityAdapterAction<TEntity, [EntityId], TSliceState>;
  removeMany: EntityAdapterAction<TEntity, [EntityId[]], TSliceState>;
  removeAll: EntityAdapterAction<TEntity, [], TSliceState>;
  setAll: EntityAdapterAction<TEntity, [TEntity[]], TSliceState>;
};

const createEntityAdapter = <TEntity extends object, TSliceState extends EntitySliceState<TEntity> = EntitySliceState<TEntity>>(options: EntityAdapterProps<TEntity>) => {
  const selectId: SelectIdMethod<TEntity> = typeof options.selectId === 'string'
        || typeof options.selectId === 'number'
        || typeof options.selectId === 'symbol'
    ? createDefaultSelectId(options.selectId)
    : options.selectId;
  const merge = (entities: TEntity[], state: TSliceState) => {
    const newState = { ...state };
    entities.forEach(entity => {
      newState.entities[selectId(entity)] = entity;
    });
    const allEntities = Object.values(newState.entities).sort(options.sortComparer);
    newState.ids = allEntities.map(selectId);
    return newState;
  };

  const addMany: EntityAdapterAction<TEntity, [TEntity[]], TSliceState> = (state, entities) => {
    const newEntities = entities.filter(entity => !(selectId(entity) in state.entities));
    return newEntities.length !== 0 ? merge(newEntities, state) : state;
  };

  const addOne: EntityAdapterAction<TEntity, [TEntity], TSliceState> = (state, entity) => addMany(state, [entity]);

  const removeAll: EntityAdapterAction<TEntity, [], TSliceState> = (state) => {
    const newState = { ...state };
    newState.ids = [];
    newState.entities = {};

    return newState;
  };

  const removeMany: EntityAdapterAction<TEntity, [EntityId[]], TSliceState> = (state, ids) => {
    const newState = { ...state };
    ids.forEach(id => {
      if (id in newState.entities) {
        delete newState.entities[id];
      }
    });
    newState.ids = Object.keys(newState.entities);
    return newState;
  };

  const removeOne: EntityAdapterAction<TEntity, [EntityId], TSliceState> = (state, id) => removeMany(state, [id]);

  const setAll: EntityAdapterAction<TEntity, [TEntity[]], TSliceState> = (state, entities) => addMany(removeAll(state), entities);

  const updateMany: EntityAdapterAction<TEntity, [Update<TEntity>[]], TSliceState> = (state, updates) => {
    const newState = { ...state };
    const updatedEntities = updates.reduce((acc, update) => {
      if (update.id in newState.entities) {
        const original = newState.entities[update.id];
        const updated: TEntity = Object.assign({}, original, update.changes);
        delete newState.entities[update.id]; // Side Effect Bad
        return [...acc, updated];
      }
      return acc;
    }, [] as TEntity[]);
    return merge(updatedEntities, newState);
  };

  const updateOne: EntityAdapterAction<TEntity, [Update<TEntity>], TSliceState> = (state, update) => updateMany(state, [update]);

  const upsertMany: EntityAdapterAction<TEntity, [TEntity[]], TSliceState> = (state, entities) => {
    const { added, updated } = entities.reduce((acc, entity) => !state.entities?.[selectId(entity)]
      ? {
        ...acc,
        added: [...acc.added, entity], 
      }
      : {
        ...acc,
        updated: [...acc.updated, {
          id: selectId(entity),
          changes: entity, 
        }], 
      },
    {
      added: [] as TEntity[],
      updated: [] as Update<TEntity>[],
    });
    return addMany(updateMany(state, updated), added);
  };

  const upsertOne: EntityAdapterAction<TEntity, [TEntity], TSliceState> = (state, entity) => upsertMany(state, [entity]);

  const actions: EntitySliceActions<TEntity, TSliceState> = {
    addMany: addMany,
    addOne: addOne,
    removeAll: removeAll,
    removeMany,
    removeOne,
    setAll: setAll,
    updateMany: updateMany,
    updateOne: updateOne,
    upsertMany: upsertMany,
    upsertOne: upsertOne,
  };

  return actions;
};

export default createEntityAdapter;
