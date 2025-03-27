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
         image:details.show.image?.medium ?? "placeHolder.jpg",
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
        image:show.image?.original ?? "placeHolder.jpg",
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
   
   
   //searchMovie("silicon");
   let searchform=document.querySelector("#searchform")
        searchform.addEventListener("submit",()=>{
        event.preventDefault();
        searchInput=document.querySelector("#showinput").value
        searchMovie(searchInput);
   })
});