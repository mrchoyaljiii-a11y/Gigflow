export const getRemeningDaysStatus = (dueDate) => {
    if (!dueDate) {
        return {
            days: 0,
            isExpired: false,
            isToday: false,
            isUpcoming: false,
        };
    }

    const today = new Date();
    const endDate = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const days = Math.ceil(
        (endDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
        days,
        isExpired: days < 0,
        isToday: days === 0,
        isUpcoming: days > 0,
    };
};