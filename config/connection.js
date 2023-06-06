const mongoose = require('mongoose');
require('dotenv').config()
const connect = async() => {
    try{
        await mongoose.connect(process.env.DB,{dbName:"Hami"})
        console.log("DataBase Connected successfully to server");
    }
    catch(err){
        console.log(err);
    }
}

connect()