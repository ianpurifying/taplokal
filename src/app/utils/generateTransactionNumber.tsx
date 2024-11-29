const generateTransactionNumber = (newOrderNumber: number) => {
    const date = new Date();
    
    // Format date components to ensure uniform length
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    
    // Ensure newOrderNumber is padded to 4 digits (or adjust as needed)
    const paddedOrderNumber = String(newOrderNumber).padStart(4, "0");
  
    // Combine components into a uniform transaction number
    return `TX${year}${month}${day}-${hours}${minutes}${seconds}-${paddedOrderNumber}`;
  }

  export default generateTransactionNumber;