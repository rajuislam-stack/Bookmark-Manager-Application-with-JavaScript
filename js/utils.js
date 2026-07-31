//fetching data from data.json

export async function fetchData() {
   try{
    const response = await fetch('./data/data.json');
    const data = await response.json()
    return data.bookmarks
   }
   catch(err){
   console.error('Could not fetch data' + err)
   }
}

