const jwt=require("jsonwebtoken")//this is the json web token 
const db=require("../configurations/pg")
const AsyncHandle=require("express-async-handler")//this handle some async exceptions
const protect =AsyncHandle(async(req,res,next)=>{// note that when writing you middle ware never forget the call the next() function
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            // get token from header
            token=req.headers.authorization.split(" ")[1];
              // verify the token.
            // this two line of code below are posible because the user Id and the  and information are in the users token
            const decoded=jwt.verify(token,process.env.JWT_SECRET)//this are important imformation that are being stored in the token , and now i am removing the payload
            // Get user from the token 
              const user=await db.query("SELECT name,email,id FROM userinfo WHERE id=$1",[decoded.id]);
              req.user=user.rows[0]
            next()
        }
        catch(err){
                  //  console.log(err)
                   res.status(401)
                   throw new Error("not authorized")
        }
    }
    if(!token){
        res.status(401)
        throw new Error("not authorized  no token")

    }  
})
module.exports=protect