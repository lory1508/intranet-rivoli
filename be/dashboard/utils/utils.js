const formatDate = (date) => {
  const formattedDate = new Date(date)
  return isDateValid(formattedDate) ? formattedDate.toLocaleString('it-IT') : "Mai modificato"
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
  return text
    .toString()
    .substring(0, limit)
    .concat('...');
}

const isDateValid = (dateStr) =>{
  return !isNaN(new Date(dateStr));
}

export {
  formatDate,
  slugify,
  getExtract
}