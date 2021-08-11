import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import createHttpError from "http-errors";

const postsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "posts.json");

const postsRouter = express.Router();

const getPosts = () => JSON.parse(fs.readFileSync(postsJSONPath));

const writePosts = content => fs.writeFileSync(postsJSONPath, JSON.stringify(content));

postsRouter.get("/", (req, res, next) => {
    // <-- optional query parameters ?title=LOTR
    try{
        console.log("Query params --> ", req.query);
        const posts = getPosts();

        if (req.query && req.query.title){
            const filteredPosts = posts.filter( post => post.title === req.query.title);
            res.send(filteredPosts);
        } 
        else
            res.send(posts);
    } 
    catch (error){
        next(error); // next(error) transmits the error to the error handlers
    }
});

postsRouter.get("/:id", (req, res, next) => {
    try {
        const posts = getPosts();
        console.log("posts[0]._id============",posts[0]._id);

        const post = posts.find( post => post._id == req.params.id);

        if (post) 
            res.send(post);
        else
            next(createHttpError(404, `Post with id ${ req.params.id } not found!`)); // 404 error is being sent to error handlers
    } 
    catch (error){
        next(error); // 500 error is being sent to error handlers
    }
});

postsRouter.post("/", (req, res, next) => {
    try {
        const posts = getPosts();

        const newPost = { ...req.body, id: uniqid(), createdAt: new Date() }

        posts.push( newPost );

        writePosts(posts);

        res.status(201).send({ id: newPost.id });
    } 
    catch (error){
        next(error);
    }
});

postsRouter.put("/:id", (req, res, next) => {
    try {
        const posts = getPosts();

        const remainingPosts = posts.filter( post => post.id !== req.params.id);

        const modifiedPost = { ...req.body, id: req.params.id };

        remainingPosts.push(modifiedPost);

        writePosts(remainingPosts);

        res.send(modifiedPost);
    } 
    catch (error){
        next(error);
    }
});

postsRouter.delete("/:id", (req, res, next) => {
    try {
        const posts = getPosts();

        const remainingPosts = posts.filter( post =>  post.id !== req.params.id);

        writePosts(remainingPosts);

        res.status(204).send();
    } 
    catch (error){
        next(error);
    }
});

export default postsRouter;
