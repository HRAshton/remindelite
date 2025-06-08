export const parseBalance = (balance: string): [number, string] | undefined => {
    const pair = balance.split(' ', 2);
    const income = parseFloat(pair[0]);
    if (!isFinite(income)) return undefined;

    return [ income, pair[1] || '' ];
};
