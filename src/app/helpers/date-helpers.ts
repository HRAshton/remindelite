export const getWeek = (date: Date): number => {
    const januaryFirst =
        new Date(date.getFullYear(), 0, 1);
    const daysToNextMonday =
        (januaryFirst.getDay() === 1) ? 0 :
            (7 - januaryFirst.getDay()) % 7;
    const nextMonday = new Date(
        date.getFullYear(),
        0,
        januaryFirst.getDate() + daysToNextMonday
    );

    return date < nextMonday
        ? 52
        : (date > nextMonday
            ? Math.ceil((date.getTime() - nextMonday.getTime())
                / (24 * 3600 * 1000)
                / 7)
            : 1);
};