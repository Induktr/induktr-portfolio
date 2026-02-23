import { useMemo } from "react";

/**
 * Хук для извлечения данных из объекта и массива.
 * Позволяет получить первый элемент, все записи объекта и общую статистику.
 */
export const useProjectData = <Trait, Obj extends object>(
  obj: Obj,
  arr: Trait[]
) => {
  return useMemo(() => {
    const entries = Object.entries(obj) as [string, any][];

    const arrays = Array.from(arr) as Trait[];

    const firstEntry = entries[0] as [string, Obj[keyof Obj]] | undefined;

    return {
      firstItem: arr[0] as Trait | undefined,
      firstEntry,
      entries,
      arrays,
      totalItems: arr.length,
      isEmpty: arr.length === 0 && entries.length === 0
    };
  }, [obj, arr]);
};
