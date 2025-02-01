import { PrismaClient } from "@prisma/client";
import { FAQ } from "../types/zod";
import translateText from "../components/translate"
import { Router } from "express";
import { RedisClientType,createClient } from "redis";
import { Adminauthorization } from "../components/middleware";
const router=Router();
const prisma =new PrismaClient();
const redis=createClient();
redis.connect();

router.post("/posts",async(req:any,res:any)=>{
   const {question,answer}=req.body;   
      const safeparse=FAQ.safeParse(req.body);
      if(!safeparse){
         return res.json({status:4000},{message:"Enter the body correctly"});
      }
      const response=await prisma.fAQ.create({
         data:{
            question,
            answer,
             
         }
      })
      const langanwer=await translateText("hi",question);
      console.log(langanwer);
      const lquestion=await translateText("hi",answer);
      const BengaliQ=await translateText("bn",question);
      const BengaliA=await translateText("bn",answer);
      await redis.lPush("hi",[langanwer,lquestion])
       await redis.lPush("bn",[BengaliA,BengaliQ]); 
      res.status(200).json(response);
  
})
router.patch("/posts/:id",Adminauthorization,async(req:any,res:any)=>{
     const id=req.params;
     if(!id){
      res.json(400,{message:"No id found"});
     }
     const faq=await prisma.fAQ.findUnique({
      where:{
         id
      }
     })
     if(!faq){
      res.json(400,{message:"No faq found,Enter a valid id"});
     }
     const {question,answer}=req.body;
     const response=await prisma.fAQ.update({
      where:{
         id
      },data:{
         question,
         answer
      }
     })
     res.json({status:200},{message:"Update succesfull",response})
})
router.get("/posts/:id",async(req:any,res:any)=>{
   const id=req.params;
   if(!id){
    res.json(400,{message:"No id found"});
   }

   const faq=await prisma.fAQ.findUnique({
    where:{
       id
    }
   })
   if(!faq){
    res.json(400,{message:"No faq found,Enter a valid id"});
   }
   res.json({status:200},{message:"Update succesfull",faq})
})
router.delete("/posts/:id",Adminauthorization,async(req:any,res:any)=>{
   const id=req.params;
   if(!id){
    res.json(400,{message:"No id found"});
   }
   const faq=await prisma.fAQ.findUnique({
    where:{
       id
    }
   })
   if(!faq){
    res.json(400,{message:"No faq found,Enter a valid id"});
   }
   const deletefaq=await prisma.fAQ.delete({
      where:{
         id
      }
   })
   res.json({status:200},{deletefaq})
})
router.get("/posts",async(req:any,res:any)=>{
  const lang=req.query.lang;
  const hin= await redis.rPop(lang)
  res.json({hin});
})
export const mains=router;
