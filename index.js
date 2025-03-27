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