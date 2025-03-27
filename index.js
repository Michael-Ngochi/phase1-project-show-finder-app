document.addEventListener("DOMContentLoaded",()=>{
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
        name:show.name,
        type:show.type,
        rating:show.rating.average ?? "N/A",
        image:show.image?.original ?? "placeHolder.png",
        premiered:show.premiered ?? "N/A",
        ended:show.ended ?? "N/A",
        language:show.language,
        genres:show.genres,
        summary:show.summary,
         }
          console.log(show);
        displayShowInfo(fullInfo);
         console.log(fullInfo);
   }
   
   function displayShowInfo(show){
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
   //searchMovie("silicon");
   let searchform=document.querySelector("#searchform")
        searchform.addEventListener("submit",()=>{
        event.preventDefault();
        searchInput=document.querySelector("#showinput").value
        searchMovie(searchInput);
   })

//    getcast(1719)   ;
});