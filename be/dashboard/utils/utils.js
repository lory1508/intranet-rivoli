import mongoose from "mongoose"

const formatDate = (date, showTime=true) => {
  if (!date) return "N/A"
  const formattedDate = new Date(date)
  if(showTime){
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };    
    return isDateValid(formattedDate) ? formattedDate.toLocaleString('it-IT', options) : "N/A"
  }
  else
    return isDateValid(formattedDate) ? formattedDate.toLocaleDateString('it-IT') : "N/A"
}

const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const getExtract = (text, limit=30) => {
  if(!text) return ""
  return text
    .toString()
    .substring(0, limit)
    .concat('...');
}

const convertIdToObjectId = (id) => {
  return new mongoose.Types.ObjectId(id)
}

const convertIdsToObjectIds = (ids) => {
  return ids.map(id => convertIdToObjectId(id))
}

const isDateValid = (dateStr) =>{
  return !isNaN(new Date(dateStr));
}

export {
  formatDate,
  slugify,
  getExtract,
  convertIdsToObjectIds,
  convertIdToObjectId
}