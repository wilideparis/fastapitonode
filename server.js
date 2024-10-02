const PORT=process.env.PORT || 4000;
const express=require("express");
const cors=require("cors")
const app=express();
const voteRouter=require("./Routes/votes")
const route=require("./Routes/userPostRuotes")
const Uroutes=require("./Routes/userInfo")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use("/",route)         
app.use("/user",Uroutes);    

app.use("/",voteRouter);
app.listen(PORT,()=>{console.log("i am listening to PORT "+ PORT)})           