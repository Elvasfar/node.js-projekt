import http from "node:http";
import fs from "fs/promises";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
