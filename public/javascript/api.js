require('dotenv').config();



// async function FetchReciepes(id){

//     const Url = 'https://the-vegan-recipes-db.p.rapidapi.com/';

//  const options = {
  
//   headers: {
//     'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//     'x-rapidapi-host': 'the-vegan-recipes-db.p.rapidapi.com'
//   }
// };

//     const data=await fetch(Url,options);
//     const response= await data.json();

//     return response;


// }

async function  FetchReciepes(){

  const data= await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian');
  const response=await data.json();

  return response.meals;
}

async function  getOnedDish(id){

  const data= await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const response=await data.json();
  
  return response.meals;
}



module.exports={
  FetchReciepes: FetchReciepes,
  getOnedDish:getOnedDish
}