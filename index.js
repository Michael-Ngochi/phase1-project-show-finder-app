

document.addEventListener("DOMContentLoaded",()=>{
//function fo adding show to favourites
async function addToFavourites(show){
show.id = String(show.id); //convert id to string
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
showFavourites();//refresh the favourites section
isFavourite(show.id); //check if show is in favourites to update the hear icon
document.getElementById("showInfo").style.display="block"
console.log('User added:', data);
console.log("YOu have clicked on "+show.name)
}

//function to remove favourites
async function removefromFavourites(id){
     let res= await fetch(`http://localhost:3000/favourites/${id}`,{
          method: 'DELETE',
     });
     if (res.ok){
          alert("Removed from favourites!");
          showFavourites();//refresh favourites
          isFavourite(id);//update the heart icon
          document.getElementById("showInfo").style.display="block"
          console.log(`Show with ID ${id} was deleted.`);
        } else {
          console.error("Failed to delete favourite.");
        }
     }
//function to search for show based on name
async function searchMovie(moviename){
    const res= await fetch(`https://api.tvmaze.com/search/shows?q=${moviename}`)
    const data= await res.json()
    const movie= await data
    //showmovies(movie)

    //store basic show information in seperate object (essentialData)
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
    document.getElementById("query-display").innerHTML=""; //reset the query display section when a new search is entered
    essentialData.forEach((show)=>{
         showmovies(show) //display the searched shows on the page
    })
     console.log(essentialData);
    }
    
    function showmovies(movie){
    document.getElementById("showInfo").style.display="none" //refresh the featured movie section.
    //create card to diaply show
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
    //listen for click on each card from the search results
    moviecard.addEventListener("click",()=>{
    getFullInfo(movie.id);
    getcast(movie.id);
    })
    queryDisplay.appendChild(moviecard)
    }

    //function to fetch further info on tv show by id
    async function getFullInfo(id){
        console.log(`fetching for id:${id}`);
         const res=await fetch(`https://api.tvmaze.com/shows/${id}`)
         const show=await res.json()
   
         //storing all the info in an object
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
        displayShowInfo(fullInfo); //display show details on the showInfo section of the page
     //     console.log(fullInfo);


     //    Clone and replace heart to remove old click listeners
         const oldHeart = document.getElementById("heart");
         const newHeart = oldHeart.cloneNode(true);
         oldHeart.parentNode.replaceChild(newHeart, oldHeart);
         newHeart.addEventListener("click",()=>{
         isAlreadyFav(show.id,fullInfo);
     })

   }

//function to display show deatils
   function displayShowInfo(show){
   isFavourite(show.id);//check if the show has already been added to favourites
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

//function to fetch the show's cast based on the show id
async function getcast(showId) {
    document.getElementById("showCast").innerHTML=""
    let res= await fetch(`https://api.tvmaze.com/shows/${showId}/cast`)
    let data=await res.json()
    data.slice(0,10).map(actorData=>{// limit the result to only the first ten actors using slice

     let actor= actorData.person.name
     let character= actorData.character.name
     let image= actorData.person.image?.medium || 'default.png'
    
//     console.log(actor)
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

   //searchMovie("silicon");

//listener for form submition to initiate the search function.
   let searchform=document.querySelector("#searchform")
        searchform.addEventListener("submit",()=>{
        event.preventDefault();
        searchInput=document.querySelector("#showinput").value
        searchMovie(searchInput);
   })

//function to fetch and display the favourite shows from the local json server
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
           getFullInfo(show.id);//show the clicked show on the featured section
           getcast(show.id);//show the cast on the featured section
         });
   
         favouritesBody.appendChild(moviecard);
       }
   
     } catch (error) {
       console.error("Failed to load favourites:", error);
     }
   }
   

//function to check if the show is already stored in the favourites
   async function isAlreadyFav(id,fullInfo) {
     try {
       const res = await fetch("http://localhost:3000/favourites");
       const favourites = await res.json();
   
       const found = favourites.some(show => show.id == id);
   
       if (!found) {
              addToFavourites(fullInfo) //show is added if not already there
         }

       else{
          removefromFavourites(id);//show is removed if already exists
       }
     } catch (error) {
       console.error("Error checking favourite:", error);
     }
   }


// function to toggle the filled state of the heart icon
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
           heartIcon.classList.add("bi-heart-fill");//heart is filled when marked as favourite
           heartIcon.classList.remove("bi-heart");
           heartIcon.style.color = " rgb(238, 14, 208)";
         }

       }else{
         if (heartIcon) {
           heartIcon.classList.add("bi-heart");
           heartIcon.classList.remove("bi-heart-fill");//heart is not filled when not marked as favourite
           heartIcon.style.color = " rgb(238, 14, 208)";
         }
       }
     } catch (error) {
       console.error("Error checking favourite:", error);
     }
   }



showFavourites(); //show favourites imediately the page loads


//    getcast(1719)   ;
});