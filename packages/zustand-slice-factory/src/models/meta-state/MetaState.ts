import { CreateMethod } from '../../utils';

export type MetaStateType = {
  lastModified: string | null;
  lastHydrated: string | null;
};

const create: CreateMethod<MetaStateType> = (args) => ({
  lastHydrated: args?.lastHydrated ?? null,
  lastModified: args?.lastModified ?? null,
});

const MetaState = {
  create: create,
};

export default MetaState;
