
    
import { Router } from "express";
import { getAllusers, getusersById, addusers, updateusers, deleteusers } from "./usersRepository.js";


    export const usersRouter = Router();

    
usersRouter.get("/", (req, res) => {
    res.json(getAllusers);
});


    
usersRouter.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = getusersById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
})


    
usersRouter.post("/", (req, res) => {
    const { name, email, created_at} = req.body ?? {};
    
    const obj = addusers(name, email, created_at);
    res.status(201).json({ obj });
})


    
usersRouter.put("/:id", (req, res) => {
    const objId = Number(req.params.id);
    let { name, email, created_at} = req.body ?? {};

    const ok = updateusers(objId, name, email, created_at);
    if (!ok) return res.status(404);
    res.status(200)
})


    
usersRouter.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    
    const ok = deleteusers(id);
    if (!ok) return res.status(404);
    res.status(204).send();
})


