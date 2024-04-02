function getWeeks(endDate, startDate) {
    return Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
}

export default getWeeks;