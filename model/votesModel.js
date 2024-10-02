const db=require("../configurations/pg")
const createTableVotes = async () => {
    const tableName = 'votes';
  
    try {
      // Check if the table exists
      const tableExistsQuery = `
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `;
  
      const result = await db.query(tableExistsQuery, [tableName]);
  
      // If table already exists, throw an error
      if (result.rows[0].exists) {
       return ;
      }else{
  
      
  
      // Table does not exist, create it
      const createTableQuery = `
        CREATE TABLE ${tableName} (
    userid INT,
    postid INT,
    PRIMARY KEY (postid, userid),
    FOREIGN KEY (userid) REFERENCES userinfo(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);
      `;
  
      await db.query(createTableQuery);
      console.log(`Table "${tableName}" has been created successfully!`);
      
    }
  } catch (err) {
      console.error('Error:', err.message);
    }
  
  };

  module.exports=createTableVotes;
