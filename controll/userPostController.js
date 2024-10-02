const jwt =require("jsonwebtoken")
const Yup = require('yup');
const db=require("../configurations/pg")
let token;




const countOnePost=async(post)=>{
    const query="select postid ,count(postid) from votes as nvotes join posts on postid=id group by postid"
    const votesObj=(await db.query(query)).rows;
    console.log( post )
  
        for(let i=0;i<votesObj.length;i++){
             if(post.id==votesObj[i].postid){
              post.vote=parseInt( votesObj[i].count)
            
             }
        }
        if(!post.vote) post.vote=0
       
    
    return post;

}

const custmonPost=async(offset,limit)=>{
let query;
   if(offset && limit){
     query=("select * from  posts  LIMIT $2 OFFSET $1 ");
      return (await db.query(query,[offset,limit])).rows;
  }  
if(offset && !limit)  { 
    query=("select * from  posts    OFFSET $1")
    return (await db.query(query,[offset])).rows;
}
        if(!offset && limit)  { 
            query=("select * from  posts LIMIT $1 ")
            return (await db.query(query,[limit])).rows;

        }
        query=("select * from  posts")
            return (await db.query(query)).rows;
}
const schema = Yup.object().shape({
   
    content: Yup.string().min(10).required(),
    title:Yup.string().min(3).required(),
    published:Yup.string().min(3),
    created_at:Yup.string().min(3),
    id:Yup.number().min(3)

});
const getpost=async(req,res)=>{
   const {limit,offset}=req.query;
    try {
        
        
        const post= await custmonPost(offset,limit)
      console.log(  )
        res.status(200)   
        res.send(await countPost(post)  )

    
    } catch (error) {
        res.status(400)
        res.json({msg:error})
    }
  
}


const createPost=async (req,res)=>{
    try {
    const  {title,content} = req.body;
     console.log(req.user.id)
        schema.validate({title,content})
         const newPosts=await db.query("insert into posts (title,content,userid) values ( $1,$2,$3)",[title,content,req.user.id])
                 

        res.send(req.body)
    res.status(200)
    } catch (error) {
        throw new Error(error)
    }
   
   

}

const getOnePost=async(req,res)=>{
    try {
        const id= parseInt(req.params.id);
        console.log(id)
       const post=await db.query(
            "select * from posts where id="+id);
            console.log(JSON.stringify(post.rows) +" <--post")
     res.json( await countOnePost(post));
    res.status(200);
    } catch (error) {        
        res.status(405)
        throw new Error(error)
    }
   } 

const deletePost=async(req,res)=>{
    try {
        const id=parseInt(req.params.id);
        
        const firstQuery="select * from posts where id=$1;"
        token=req.headers.authorization.split(" ")[1];

        const results=await db.query(firstQuery,[id]);
        postid=results.rows[0].userid;
       if(parseInt(postid)==jwt.verify(token,process.env.JWT_SECRET).id){
            await  db.query(
                "delete from posts where id=$1",[id]
            )
            if(db.query){
                res.status(202)

                res.json({msg:"deletion successful"})
                }
                else{
                    res.status(405)
                    res.json({msg:"invalid id"})   
                }
       }else{
        res.json("you are not authorized to delete a post with id of "+ postid)
       }
      
        
    } catch (error) {
            res.status(404)
            res.json({msg:error})  
            throw new Error(error)   
       }
        
    
}


const UpdatePost = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { title, content} = req.body;

        // Validate the request body
        await schema.validate({ title, content});
        
        const firstQuery="select * from posts where id=$1;"
        token=req.headers.authorization.split(" ")[1];

        const results=await db.query(firstQuery,[id]);
        postid=results.rows[0].userid;
       if(parseInt(postid)==jwt.verify(token,process.env.JWT_SECRET).id){
         const result = await db.query(
            "UPDATE posts SET title = $1, content = $2  WHERE id = $3",
            [title, content, id]
        );

        // Check if any row was updated
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
         console.log(  req.user +" that is it there you de find watty for here")
        res.status(200).json({ message: 'Post updated successfully', post: { id, title, content} });
    }else{
        res.send({message:"you are not authorized to update this post"})
    }

        // Use parameterized query to prevent SQL injection
       
    } catch (error) {
        console.error(error);
        if (error instanceof Yup.ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
}
module.exports={createPost,getpost,getOnePost,deletePost,UpdatePost}