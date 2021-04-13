  /**
   * @param {Date} date
   * @returns {string}
  */
 
  //Using date options will convert and parse a date into a string.
   export function formatADateAndTime(date){
    if(date === "0001-01-01T00:00:00"){
      return "Not Yet Checked out"
    }
    else
    {

    
    const options = 
    {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: true
    };
    const tempDate = new Date(Date.parse(date));
    const tempDateTime = new Intl.DateTimeFormat('en-GB', options).format(tempDate);
    return tempDateTime;
  }
}