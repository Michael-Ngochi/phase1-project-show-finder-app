# Show Finder

**Show Finder** is a simple web app that lets users search for TV shows using the [TVmaze API](https://www.tvmaze.com/api). Users can view ratings, posters, premiere dates, genres, and cast information.

## Features

- Search TV shows by name  
- Display basic info in cards: title, year, and rating  
- View detailed info including summary, genres, and cast  
- Responsive design with custom CSS and Bootstrap
- Favourites persist using a `json-server` mock API  
- Visual heart icon shows favourite status per show  
- Responsive design with custom CSS and Bootstrap 5


## Technologies Used

- HTML5, CSS3  
- JavaScript (Vanilla)  
- Bootstrap 5  
- [TVmaze API](https://www.tvmaze.com/api)  
- `json-server` for local storage

## Usage

1. Make sure `json-server` is installed:

   ```
   npm install -g json-server
   ```

2. Run the backend with:

   ```
   json-server --watch db.json
   ```

3. Open `index.html` in a browser  

4. Search for a show using the search bar  

5. Click a show card to view full info and cast  

6. Click the heart icon to add/remove from favourites  

7. Click the “Favourites” button to view all saved shows in a scrollable top panel


## Project Structure

```
├── db.json           # Local JSON database for favourites
├── index.html        # Main HTML file
├── index.js          # App logic
├── styles.css        # Custom styles
├── README.md         
```


## Author

Developed by **Michael Ngochi**
