

document.addEventListener("DOMContentLoaded",()=>{

async function addToFavourites(show){
show.id = String(show.id);
let res= await fetch("http://localhost:3000/favourites",{
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(show)
}
);


const data = await res.json();
alert(`${show.name} has been added to your favourites!`)
showFavourites();
isFavourite(show.id);
document.getElementById("showInfo").style.display="block"
console.log('User added:', data);
console.log("YOu have clicked on "+show.name)
}


async function removefromFavourites(id){
     let res= await fetch(`http://localhost:3000/favourites/${id}`,{
          method: 'DELETE',
     });
     if (res.ok){
          alert("Removed from favourites!");
          showFavourites();
          isFavourite(id);
          document.getElementById("showInfo").style.display="block"
          console.log(`Show with ID ${id} was deleted.`);
        } else {
          console.error("Failed to delete favourite.");
        }
     }

async function searchMovie(moviename){
    const res= await fetch(`https://api.tvmaze.com/search/shows?q=${moviename}`)
    const data= await res.json()
    const movie= await data
    //showmovies(movie)
    let essentialData=movie.map((details)=>{
         return{
         id:details.show.id,
         name:details.show.name,
         type:details.show.type,
         rating:details.show.rating.average ?? "N/A",
         image:details.show.image?.medium ?? "placeHolder.png",
         year:details.show.premiered?.split("-")[0] ?? "N/A"
         }
    })
    document.getElementById("query-display").innerHTML="";
    essentialData.forEach((show)=>{
         showmovies(show)
    })
     console.log(essentialData);
    }
    
    function showmovies(movie){
    document.getElementById("showInfo").style.display="none"
    queryDisplay=document.getElementById("query-display")
    moviecard=document.createElement("div")
    moviecard.className = "card movie-card";
    // moviecard.style.backgroundImage = `url(${movie.image})`;
    moviecard.innerHTML=`
    <span class="card-text" id="card-rating">${movie.rating}</span>
    <div class="movie-poster" id="movie-poster" style="background-image: url(${movie.image});"></div>
    <div class="card-teaxtarea">
    <span class="card-title" id="card-title">${movie.name}</span>
    <span class="card-type" id="card-type">${movie.year}</span>
    </div>
    `
    moviecard.addEventListener("click",()=>{
    getFullInfo(movie.id);
    getcast(movie.id);
    })
    
    queryDisplay.appendChild(moviecard)
    }

    async function getFullInfo(id){
        console.log(`fetching for id:${id}`);
         const res=await fetch(`https://api.tvmaze.com/shows/${id}`)
         const show=await res.json()
   
         const fullInfo={
        id:String(show.id),
        name:show.name,
        type:show.type,
        rating:show.rating.average ?? "N/A",
        image:show.image?.original ?? "placeHolder.png",
        smallImage:show.image?.medium ?? "placeHolder.png",
        premiered:show.premiered ?? "N/A",
        year:show.premiered?.split("-")[0] ?? "N/A",
        ended:show.ended ?? "N/A",
        language:show.language,
        genres:show.genres,
        summary:show.summary,
         }
          // console.log(show);
        displayShowInfo(fullInfo);
         console.log(fullInfo);

         const oldHeart = document.getElementById("heart");
         const newHeart = oldHeart.cloneNode(true);
         oldHeart.parentNode.replaceChild(newHeart, oldHeart);
         newHeart.addEventListener("click",()=>{
         isAlreadyFav(show.id,fullInfo);
     })

   }

   function displayShowInfo(show){
   isFavourite(show.id);
   document.getElementById("genres").innerHTML=""
   document.getElementById("showInfo").style.display="block"
   document.getElementById("infoPoster").style.backgroundImage = `url(${show.image})`;
   document.getElementById("infoTitle").innerHTML=show.name
   document.getElementById("infoSummary").innerHTML=show.summary
   document.getElementById("infoPremiered").innerHTML=`<strong>Premiered </strong>${show.premiered}`
   document.getElementById("infoLanguage").innerHTML=`<strong>Language </strong>${show.language}`
   for (genre of show.genres){
        genreSpan=document.getElementById("genres")
        genreSpan.append(`  ${genre},`)
   }

    
   }

async function getcast(showId) {
    document.getElementById("showCast").innerHTML=""
    let res= await fetch(`https://api.tvmaze.com/shows/${showId}/cast`)
    let data=await res.json()
    data.slice(0,10).map(actorData=>{

     let actor= actorData.person.name
     let character= actorData.character.name
     let image= actorData.person.image?.medium || 'default.png'
    
    console.log(actor)
    let showCast=document.getElementById("showCast")
    let actorCard=document.createElement("div")
    actorCard.className="actor-card card"
    actorCard.innerHTML=`
                <img class="actorImg" src="${image}" alt="">
                <div class="actor" id="actor" style="font-weight: 600; font-size:small;">${actor}</div>
                <div class="character" id="character" style="font-weight: 300; font-size:smaller;">${character}</div>
                `
    showCast.appendChild(actorCard)
}
)
}



// })
   //searchMovie("silicon");
   let searchform=document.querySelector("#searchform")
        searchform.addEventListener("submit",()=>{
        event.preventDefault();
        searchInput=document.querySelector("#showinput").value
        searchMovie(searchInput);
   })


   async function showFavourites() {
     try {
       const res = await fetch("http://localhost:3000/favourites");
       const shows = await res.json();
   
       const favouritesBody = document.getElementById("favourites-body");
       favouritesBody.innerHTML = ""; // Clear previous content if needed
   
       for (const show of shows) {
         console.log(show);
   
         const moviecard = document.createElement("div");
         moviecard.className = "card movie-card";
   
         moviecard.innerHTML = `
           <span class="card-text" id="card-rating">${show.rating}</span>
           <div class="movie-poster" id="movie-poster" style="background-image: url(${show.image});"></div>
           <div class="card-teaxtarea">
             <span class="card-title" id="card-title">${show.name}</span>
             <span class="card-type" id="card-type">${show.year}</span>
           </div>
         `;
   
         moviecard.addEventListener("click", () => {
           getFullInfo(show.id);
           getcast(show.id);
         });
   
         favouritesBody.appendChild(moviecard);
       }
   
     } catch (error) {
       console.error("Failed to load favourites:", error);
     }
   }
   


   async function isAlreadyFav(id,fullInfo) {
     try {
       const res = await fetch("http://localhost:3000/favourites");
       const favourites = await res.json();
   
       const found = favourites.some(show => show.id == id);
   
       if (!found) {
              addToFavourites(fullInfo)
         }

       else{
          removefromFavourites(id);
       }
     } catch (error) {
       console.error("Error checking favourite:", error);
     }
   }

   async function isFavourite(id) {        
     try {
       const res = await fetch("http://localhost:3000/favourites");
       const favourites = await res.json();
     //   console.log("cheking for show:"+id);

       const found = favourites.some(show => show.id === id);
       console.log(found);
       const heartIcon = document.getElementById("heartIcon");
   
       if (found) {
         if (heartIcon) {
           heartIcon.classList.add("bi-heart-fill");
           heartIcon.classList.remove("bi-heart");
           heartIcon.style.color = " rgb(238, 14, 208)";
         }

       }else{
         if (heartIcon) {
           heartIcon.classList.add("bi-heart");
           heartIcon.classList.remove("bi-heart-fill");
           heartIcon.style.color = " rgb(238, 14, 208)";
         }
       }
     } catch (error) {
       console.error("Error checking favourite:", error);
     }
   }



showFavourites();


//    getcast(1719)   ;
});