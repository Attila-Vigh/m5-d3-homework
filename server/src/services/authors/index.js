// ****************************** Author CRUD ***************************

/*
?    1. CREATE        --> POST   http://localhost:4000/authors      (+ body)
?    2. READ          --> GET    http://localhost:4000/authors      (+ optional query params)
?    3. READ (SINGLE) --> GET    http://localhost:4000/authors/:id
?    4. UPDATE        --> PUT    http://localhost:4000/authors/:id  (+ body)
?    5. DELETE        --> DELETE http://localhost:4000/authors/:id
*/

import express from "express";        // 3rd party module
import { fileURLToPath } from "url";  // core module
import { dirname, join } from "path"; // core module
import fs from "fs";                  // core module
import uniqid from "uniqid";         // 3rd party module

const authorsRouter = express.Router();

// To obtain authors.json file path I need to do:
const currentFilePath = fileURLToPath(import.meta.url);       // 1. I'll start from the current file I am in (index.js) obtaining the file path to it

const currentDirPath = dirname(currentFilePath);              // 2. I'll obtain the current folder index.js file is in (src/services/author folder)

const authorsJSONPath = join(currentDirPath, "authors.json"); // 3. I'll concatenate folder path with authors.json

const booksJSONPath = join(dirname(fileURLToPath(import.meta.url)), "books.json")


/* 
    WINDOWS STYLE --> "C:\\Strive\\FullStack\\2021\\May21\\M5\\strive-m5-d2-may21\\src\\services\\author\\authors.json"
    UNIX STYLE --> M5//D2//strive-m5-d2-may21//src//services//author//authors.json"

    DO NOT CONCATENATE PATHS USING '+' SYMBOL, USE JOIN INSTEAD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
// 1. CREATE
authorsRouter.post("/", (request, response) => {

    // 1. read the content of authors.json file
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath));
    
    if ( authors.some( author => author.email === request.body.email ) )

        response
            .status(400)
            .send  ("Email already exists");
    else {
        // 2. read the request body obtaining the new author's data
        const newAuthor = { ...request.body, id: uniqid(), data: new Date() };
        
        // 3. add new author to the array
        authors.push(newAuthor);

        // 4. Overwrite the authors.json file
        fs.writeFileSync(authorsJSONPath, JSON.stringify( authors ));
        // 5. send back proper response
        response
            .status( 201 )
            .send  ({ id: newAuthor.ID });

        
    }
});

// 2. READ
authorsRouter.get("/", (request, response) => {
    // 1. read authors.json file content and get back an array of author

    const fileContent = fs.readFileSync(authorsJSONPath); // we get back a BUFFER which is the content of the file (MACHINE READABLE)

    // 2. send back as a response the array of author
    response.send(JSON.parse(fileContent)); // JSON parse converts BUFFER into JSON
});

// 3. READ (SINGLE) 
authorsRouter.get("/:authorID", (request, response) => {
    // 1. read authors.json file content and get back an array of author

    const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

    // 2. find the one with the specified id
    console.log("AUTHOR ID: ", request.params.authorID);

    const author = authors.find(author => author.ID === request.params.authorID);

    // 3. send it back as a response

    response.send(author);
});

// 4. UPDATE
authorsRouter.put("/:authorID", (request, response) => {
    // 1. read authors.json file content
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath));

    // 2. modify the specified author
    const remainingAuthors = authors.filter(author => author.ID !== request.params.authorID);

    const updatedAuthor = { ...request.body, id: request.params.authorID };

    remainingAuthors.push(updatedAuthor);

    // 3. save the file with the updated list of author
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

    // 4. send back a proper response
    response.send(updatedAuthor);
});

// 5. DELETE
authorsRouter.delete("/:authorID", (request, response) => {
    // 1. read authors.json file content
    const author = JSON.parse(fs.readFileSync(authorsJSONPath));

    // 2. filter out the specified authorID from the array
    const remainingAuthors = author.filter(author => author.id !== request.params.authorID);

    // 3. write the remaining author back to the authors.json file
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

    // 4. send back a proper response
    response.status(204).send();
});

export default authorsRouter;
