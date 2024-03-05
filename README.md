## GREETINGS. THANKS FOR REVIEWING MY CODE - LETS GO! 🚀

## Description

This is Robust REST API with Node.js. This case study is part of my job
application process.

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js
- npm
- MongoDB
- curl

## Installation

1. Extract the contents of the zip file to your desktop.
2. In your terminal and make sure you're in the desktop directory. Navigate to
   the project folder:

```sh
cd erewhonCaseStudy
```

3. Inside the project folder, install dependencies with this command:

```sh
npm install


```

#### Before running the app you need to make sure you have a MongoDB Atlas Account or Local MongoDB Server.

#### You need to replace my mongo uri with your mongo uri in the `app.js` file.

## Running the Application

1. Once you installed your dependencies. run this command in your terminal to
   run the server:

```sh
npm start
```

This will start the server, and you should see a message indicating that the
server is running on http://localhost:8080.

2. Open your web browser and navigate to http://localhost:8080.

## API endpoints

- http://localhost:8080/books -> this fetches all the books. An example for
  pagination is: http://localhost:8080/books?page=1&pageSize=5

- http://localhost:8080/books/:bookId -> this fetches a specific book based on
  id. Replace ':bookId' with a book id.

- http://localhost:8080/books/stats -> this fetches additional information about
  the books.

- http://localhost:8080/books/search?q= -> this allows you to search by either
  author or title

```sh
'/seach?q=catcher'
returns:
{
"_id": "65e65722b649945f33968485",
"title": "The Catcher in the Rye",
"author": "J.D. Salinger",
"publicationYear": 1951,
}
```

```sh
'/seach?q=harper lee'
returns:
{
"_id": "65e573fee9f9968422a98aa9",
"title": "To Kill a Mockingbird",
"author": "Harper Lee",
"publicationYear": 1960,
"__v": 0
}
```

#### You need curl to use POST, PUT and DELETE

- ADDING A NEW BOOK -> In order to add a new book, in your terminal add this
  line:

```sh
curl -X POST -H "Content-Type: application/json" -d '{"title": "Al's cook book", "author": "Al Bundy", "publicationYear": "1990"}' http://localhost:8080/books
```

- UPDATING AN EXISTING BOOK -> In order to update an existing book you would
  need the book id. Replace the ':bookId' in the curl command with the actual id
  of the book

  In your terminal add this line: (don't forget to add the book id.)

```sh
curl -X PUT -H "Content-Type: application/json" -d '{"title": "Updated Book", "author": "Jane Doe", "publicationYear": "1990"}' http://localhost:8080/books/:bookId
```

- DELETING AN EXISTING BOOK -> In order to delete an existing book you would
  need the book id. Replace the ':bookId' in the curl command with the actual id
  of the book

  In your terminal add this line: (don't forget to add the book id.) line:

```sh
curl -X DELETE http://localhost:8080/books/:bookId
```

## Testing the Application

```sh
npm test
```
