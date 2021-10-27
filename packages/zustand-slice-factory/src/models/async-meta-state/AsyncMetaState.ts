import StatusEnum from '../../constants/StatusEnum';
import { CreateMethod } from '../../utils';
import MetaState, { MetaStateType } from '../meta-state';

export type AsyncMetaStateType<TError extends Error = Error> = MetaStateType & {
  status: StatusEnum;
  error: TError | null;
};

const create: CreateMethod<AsyncMetaStateType> = <TError extends Error = Error>(args?: Partial<AsyncMetaStateType<TError>>): AsyncMetaStateType<TError> => ({
  ...MetaState.create(args),
  error: args?.error ?? null,
  status: args?.status ?? StatusEnum.Settled,
});

const AsyncMetaState = {
  create: create,
};

export default AsyncMetaState;
