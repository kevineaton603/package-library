import { CreateMethod } from '../../utils';

export type MetaStateType = {
  lastModified: string | null;
};

const create: CreateMethod<MetaStateType> = (args) => ({
  lastModified: args?.lastModified ?? null,
});

const MetaState = {
  create: create,
};

export default MetaState;
