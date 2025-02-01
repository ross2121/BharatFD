import express from "express"
import { mains } from "./crud/main";
import { PrismaClient } from "@prisma/client";

import cors from "cors"

const app= express();
const prisma=new PrismaClient()
// const translate=new TranslationServiceClient();
// const  translate=new Translate()

app.use(express.json());
app.use(cors());

app.use("/api/v1",mains);
app.listen("3000",()=>{
    console.log("Listening at 3000");
})


