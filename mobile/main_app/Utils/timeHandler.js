const formatTime = minutes => {
  if (minutes > 60) {
    let hours = Math.round(minutes / 60);
    let remainder = minutes % 60;
    return `${hours} hrs ${remainder} min`;
  } else {
    return `${minutes} min`;
  }
};

const getTotalTime = (prepTime, cookTime) => {
  let total = prepTime + cookTime;
  return formatTime(total);
};

const timeHandler = {
  formatTime,
  getTotalTime,
};
export default timeHandler;
