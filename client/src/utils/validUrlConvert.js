const validUrl = (name) =>{
    return name?.toString()
    .toLowerCase()               // lowercase
    .trim()                       // remove leading/trailing spaces
    .replace(/\s+/g, '-')         // spaces → hyphen
    .replace(/[&,+()@]/g, '-')    // replace common unsafe chars
    .replace(/[^a-z0-9-]/g, '')   // remove all other non-alphanumeric
    .replace(/--+/g, '-')         // multiple hyphens → single
    .replace(/^-+/, '')           // trim hyphen from start
    .replace(/-+$/, ''); 
}
export default validUrl