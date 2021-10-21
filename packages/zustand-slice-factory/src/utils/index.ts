export type CreateMethod<TModel> = (args?: Partial<TModel>) => TModel;

type RecordKey = string | number | symbol;

export const createRecordFromArray = <T>(list: T[], keySelector: (item: T) => RecordKey): Record<RecordKey, T> => {
    return list.reduce((acc, item) => ({ ...acc, [keySelector(item)]: item }), {})
}