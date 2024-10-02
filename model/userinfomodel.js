const db= require("../configurations/pg");




const createTable = async () => {
  const tableName = 'userInfo';

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
        id SERIAL PRIMARY KEY NOT NULL,
        email VARCHAR(100) NOT NULL  UNIQUE,
        name VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `;

    await db.query(createTableQuery);
    console.log(`Table "${tableName}" has been created successfully!`);
    
  }
} catch (err) {
    console.error('Error:', err.message);
  }

};


module.exports=createTable;
