
    
import { Router } from "express";
import { getAllposts, getpostsById, addposts, updateposts, deleteposts } from "./postsRepository.js";


    export const postsRouter = Router();

    
postsRouter.get("/", (req, res) => {
    res.json(getAllposts);
});


    
postsRouter.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = getpostsById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
})


    
postsRouter.post("/", (req, res) => {
    const { user_id, title, body, published} = req.body ?? {};
    
    const obj = addposts(user_id, title, body, published);
    res.status(201).json({ obj });
})


    
postsRouter.put("/:id", (req, res) => {
    const objId = Number(req.params.id);
    let { user_id, title, body, published} = req.body ?? {};

    const ok = updateposts(objId, user_id, title, body, published);
    if (!ok) return res.status(404);
    res.status(200)
})


    
postsRouter.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    
    const ok = deleteposts(id);
    if (!ok) return res.status(404);
    res.status(204).send();
})


