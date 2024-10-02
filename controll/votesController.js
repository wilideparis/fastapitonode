const yup=require("yup");
const jwt=require("jsonwebtoken")
const db=require("../configurations/pg")


// const schema=yup.object().shape({
//     dir:yup.number().required,
//     postid:yup.number().required("enter the postid yam"),
//     userId:yup.number().required("enter the user id goat")
// })
const voteModel=require("../model/votesModel")
voteModel();

//  this is to add a vote made by any user
const votes=async(req,res)=>{
    const {dir,postid}=req.body;
     console.log(dir,postid)  

    try {
        const token=req.headers.authorization.split(" ")[1];

       const userid=jwt.verify(token,process.env.JWT_SECRET).id;
        // schema.validate(dir,postid,userid)
     
        if(dir===1){
            res.status(202)

            const dbrequest="INSERT INTO votes(postid,userid) VALUES($1,$2);";
            const result=  await db.query(dbrequest,[postid,userid]);
            if(result) return       res.send({message :"the vote was succefully added"})


        }
        else if(dir===0){
          res.status(202)
          const dbrequest="delete from votes where postid=$1 and userid=$2"
            await db.query(dbrequest,[postid,userid])
            res.send({message :"the vote was succefully deleted"})

        }
    } catch (error) {
         throw new Error(error)
    }
  

}

module.exports=votes   