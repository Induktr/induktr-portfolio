type ExtraDataProps<T> = {
    value: T | T[];
}

export const extraData = <T>({ value }: ExtraDataProps<T>): Record<string, T> | T[] => {
    const initialObj: Record<string, T> = {};

    const initalArray = Array.of(value);

    const extraArray = initalArray.flatMap((item) => item);

    return initialObj ? initialObj : extraArray;
}