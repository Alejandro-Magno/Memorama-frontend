
//563492ad6f9170000100000166684529eb26499ba5fe77c7eb8a6151
//563492ad6f9170000100000103da485e3e614ecd9a308f4ae77ba519
export default async function fetchData(amount,query) {
     let apikey = "563492ad6f917000010000010d1e410d19224232b077571032f46ed1";
     //Actualizar el query con el nuevo valor
       
  let data = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&page=${1}&per_page=${amount}&}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: apikey, //use the apikey you have generated
      }
    }
       
  );
 
  if (data.status === 200) {
    const dataJson = await data.json();
    console.log(1);
    return dataJson;
  } else {
    let apikey2 = "563492ad6f9170000100000103da485e3e614ecd9a308f4ae77ba519";
       data = await fetch(
         `https://api.pexels.com/v1/search?query=${query}&page=${1}&per_page=${amount}&}`,
         {
           method: "GET",
           headers: {
             Accept: "application/json",
             Authorization: apikey2, //use the apikey you have generated
           },
         }
       );
      console.log(2)
       return data.json();
  }
  

  
 
    
  
 
  
}
