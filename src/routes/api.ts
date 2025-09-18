
import { Router } from "express";
import { usersRouter } from "./users/users.js";
import { postsRouter } from "./posts/posts.js";
export const api = Router();

api.use("/users", usersRouter);
api.use("/posts", postsRouter);
