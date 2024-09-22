// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);

export default app;
