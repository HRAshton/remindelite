/**
 * Groups elements in the array based on a key returned by the callback function.
 * @param keyFn The function that returns the key to group by
 * @returns An object where keys are the group keys and values are arrays of elements in that group
 */
export const groupBy = <T, K>(
    list: T[],
    keyFn: (item: T) => K,
): Record<string, T[]> => {
    return list
        .reduce((result: Record<string, T[]>, item: T) => {
            const key = String(keyFn(item));
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(item);
            return result;
        }, {});
};

/**
 * Calculates the avg of all elements in the array.
 * @returns The avg of all elements in the array
 */
export const avgOf = <T>(list: T[], keyFn: (item: T) => number): number => {
    const total = list.reduce((sum, item) => sum + keyFn(item), 0);
    return total / list.length;
}
