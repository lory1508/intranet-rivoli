const formatDate = (date) => {
  console.log(date)
  const formattedDate = new Date(date)
  return isDateValid(formattedDate) ? formattedDate.toLocaleString('it-IT') : "Mai modificato"
}

const isDateValid = (dateStr) =>{
  return !isNaN(new Date(dateStr));
}

export {
  formatDate
}