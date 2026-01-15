export const useExtraObj = (prop: Record<string, any>): [key: string, value: any] => {
    return Object.entries(prop)
    .reduce(([prevKey, prevValue]) => [prevKey, prevValue]);
}

export function useExtraData<T>(prop: Record<string, any>, values: T[]): [key: string, value: any] | T[] {
    const extraObj = Object.entries(prop)
    .reduce(([prevKey, prevValue]) => [prevKey, prevValue]);

    const extraArr = values.flatMap((value) => value);

}