import { EntityId, EntitySliceActions } from "../../types";
import { MetaState } from "../meta-state";

export type EntityStateType<TAppState extends object, TEntity extends object, TActions extends EntitySliceActions<TAppState, TEntity> = EntitySliceActions<TAppState, TEntity>> = MetaState & {
    ids: EntityId[];
    entities: Record<EntityId, TEntity>;
    actions: TActions
}

const create = <TAppState extends object, TModel extends object>(args?: Partial<EntityStateType<TAppState, TModel>>): EntityStateType<TAppState, TModel> => {
    if(!args?.actions) {
        throw new Error('Missing Required Property: actions');
    }
    return({
        ids: args?.ids ?? [],
        entities: args?.entities ?? {},
        lastHydrated: args?.lastHydrated ?? null,
        lastModified: args?.lastModified ?? null,
        actions: args?.actions 
    })
}

const EntityState = {
    create: create
}

export default EntityState;
