// Your code here
document.addEventListener('DOMContentLoaded', () => {
    // Get first movie and showcase to user on load
    fetch('http://localhost:3000/films/1')
    .then(res => res.json())
    .then(mov => {
        updateDom(mov)
    })

    // Get all movies, create clickable titles and deletes
    fetch('http://localhost:3000/films')
    .then(res => res.json())
    .then((data) => {
        data.forEach((dt) => {
            titlesCreator(dt, data)
        })
    })

})

// To loop over fetched movies and update DOM
function titlesCreator(dt, data) {
    let title = document.createElement('li')
    title.innerText = dt.title.toUpperCase()
    title.classList += 'film item'
    title.style.cursor = 'pointer'

    let del = document.createElement('button')
    del.innerText = "Delete"
    title.appendChild(del)

    title.addEventListener('click', () => {
        updateDom(dt, title)
    })

    del.addEventListener('click', () => {
        deleteMovie(dt, title, data)
    })
    document.getElementById('films').appendChild(title)
}

// To ensure non-accumulation of handlers for buying ticket movie object
let buyTicketHandler = null

// Updates DOM for each movie
function updateDom(movie, titleEl) {
    let poster = document.getElementById('poster')
    poster.src = movie.poster
    poster.alt = movie.title

    document.getElementById('title').innerText = movie.title.toUpperCase()
    document.getElementById('runtime').innerText = `${movie.runtime} minutes`
    document.getElementById('film-info').innerText = movie.description
    document.getElementById('showtime').innerText = movie.showtime
    document.getElementById('ticket-num').innerText = movie.capacity - movie.tickets_sold

    // To check whether previous handler is still attached
    if (buyTicketHandler !== null) {
        document.getElementById('buy-ticket').removeEventListener('click', buyTicketHandler)

    }

    // New handler
    buyTicketHandler = () =>  {
        buyTicket(movie, titleEl)
    }

    // New handler attached
    document.getElementById('buy-ticket').addEventListener('click', buyTicketHandler)
}

// Updates DOM and backend on click of Buy Tickets
function buyTicket(movie, titleEl){
    movie.tickets_sold += 1
    
    fetch(`http://localhost:3000/films/${movie.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movie)
    })
    .then(res => res.json())
    .then((mov) => {
        console.log(mov)
    })


    document.getElementById('ticket-num').innerText = movie.capacity - movie.tickets_sold
    if (movie.capacity - movie.tickets_sold === 0) {
        document.getElementById('buy-ticket').innerText = "SOLD OUT"
        document.getElementById('buy-ticket').disabled = true
        titleEl.classList.add('sold-out')
    }
}

// Delete button function handler
function deleteMovie(movie, titleEl, movies) {
    fetch(`http://localhost:3000/films/${movie.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(res => res.json())
    .then(() => {
        titleEl.remove()
        fetch(`http://localhost:3000/films`)
        .then(res => res.json())
        .then((movies) => {
            console.log(movies)
            movies.forEach((d) => {
                titlesCreator(d)
            })
            updateDom(movies[0], title)
            })
        })
}