function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());
  
    const dates = [];
  
    // ✅ Exclude end date
    while (date < endDate) {
        const dateString = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
        dates.push(dateString);
        date.setDate(date.getDate() + 1);
    }
  
    return dates;
}
export {getDatesInRange};
  