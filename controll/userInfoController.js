const createUserInfo=require("../model/userinfomodel");
const Yup=require("yup");
const db=require("../configurations/pg");
const jwt= require("jsonwebtoken");
const hashpassword=require("../configurations/utils");
createUserInfo();


const schema = Yup.object().shape({
    name: Yup.string().min(3).required(),
    email: Yup.string().min(10).required(),
    password:Yup.string().min(3).required(),
    id:Yup.number().min(3)


});

const userSchema=Yup.object().shape({
    name: Yup.string().min(3).required(),
    email: Yup.string().min(10).required(),
})

const userloginSchema=Yup.object().shape({
    password: Yup.string().min(3).required("where is you is your password "),
    email: Yup.string().min(10).required("can you enter your email"),
})

const createUser=async(req,res)=>{
    try {


        schema.validate(req.body);
        console.log(JSON.stringify(req.body ) + " this is the response of the request");

        const {name,email,password}=req.body;
        const hpassword= await hashpassword(password);
    
        const Query=`INSERT INTO userInfo (name,email,password) VALUES($1,$2,$3)`
    
       const newuser=  await  db.query(Query,[name,email,hpassword]);
       if(newuser){
        res.json({name,email,hpassword})
        res.status(201)
       }else{
        res.status(400)
        throw new Error("the user was not succesfully created")
       }
    } catch (error) {
        res.status(400)
        res.json({msg:error +" this is bull sheet"})
    }
    
}


const getUser=async(req,res)=>{
    const id=parseInt( req.params.id)
    const results=await db.query("SELECT * FROM userInfo WHERE id=$1",[id]);
    if(results.rowCount>0){
       const user= await userSchema.validate(results.rows[0],{stripUnknown:true})
        res.status(200);
        res.send(user)
        console.log(user)
    }else{res.status(401)
        res.send({msg:" the user with id of "+ id + " does not exist"})
    }

}


const  login=async(req,res)=>{

    const ExistingUser= await userloginSchema.validate(req.body,{stripUnknown:true})
      const query="SELECT * FROM userinfo WHERE email=$1"
      const results=await db.query(query,[ExistingUser.email]);
      if(results){
        res.status(203);
       const user= {name:results.rows[0].name,email:results.rows[0].email,token: generateToken(results.rows[0].id) }
        res.send(user)
      }else{
        res.status(403)
        res.send("there is no such user");
      }
}

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:"30d",
    })
  } 


module.exports={createUser,getUser,login}