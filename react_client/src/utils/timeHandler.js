const formatTime = (minutes) => {
    if (minutes > 60) {
        let hours = minutes / 60
        let remainder = minutes - hours
        return `${hours} hrs ${remainder} min`
    } else {
        return `${minutes} min`
    }
}

const getTotalTime = (prepTime, cookTime) => {
    let total = prepTime + cookTime
    return formatTime(total)
}

const timeHandler = {
    formatTime,
    getTotalTime
}
export default timeHandler