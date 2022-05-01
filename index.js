const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};
const datastructure = require("./schema");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */
 const db = require("./model");
const { query } = require("express");
(async()=>{try {
     await db.authenticate();
     await db.sync();
        console.log('Connection has been established successfully.');
    } 
        
    
   catch (error) {
    console.error('Unable to connect to the database:', error);
  }})();

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});
app.post('/newApp', async(req, res) => {
    console.log(req.body);
    //define new table in db with strings
    try{
    await db.define(req.body.appName,datastructure,{timestamps:false}
        )
     db.sync().then(async() => {
         console.log("Table created successfully.");
         await db.query(`INSERT INTO ${req.body.appName} (appName) VALUES ('${req.body.appName}')`);
            res.json({message:"Table created successfully"});
        });
        
    
}   

catch(err){
    res.send(err);
}

}

    )
/*update data to appName table manually from the frontend
  with the parameters from req.body where meterics are received as an array of objects
*/
app.post('/updateApp', async(req, res) => {
    console.log(req.body);
     let meterics=[];
     meterics=req.body.meterics;
        let appName=req.body.appName;
    meterics.forEach(async(element)=>{
        await db.query(`UPDATE ${appName} SET ${element.name}=${element.value}`);
    }
    )
    db.sync().then(async() => {
        console.log("Table updated successfully.");
        res.json({message:"Table updated successfully"});
    });
}
)


app.get('/getApp', async(req, res) => {
    try{
    const appName =req.body.appName;
    console.log("App name is "+appName);
    const app = await db.query(`SELECT * FROM meterics.${appName} `);
    res.send(app[0]);
}
catch(err){
    res.send(err);

}})

app.post('/update', async(req, res) => {
    try{
        const  meteric = req.body.meteric;
        const appName = req.body.appName;
        const type =req.body.type
        //check if the meteric is already in the table and if its value is greater than 0 incase if its a decrement value
        const check = await db.query(`SELECT * FROM meterics.${appName} WHERE ${meteric}>0`);
        if(check[0].length>0 && type=="decrement"){
            //if the meteric is already in the table and its value is greater than 0 then update the value
            await db.query(`UPDATE ${appName} SET ${meteric}=${meteric}-1`);
            res.json({message:"Meteric updated successfully"});
        }
        else{
        if(type=="increment"){
        type==="increment"?await db.query(`UPDATE ${appName} SET ${meteric} = ${meteric} + 1`):res.json({message:"Meteric type is not valid"});
        }
    }
        db.sync().then(async() => {
            console.log("Data updated successfully.");
            res.json({message:"Data updated successfully"});
        });
    }
    catch(err){
        res.send(err);
    }
})
    

// BillingIssues:
// Refundevents
// Refundmoney
// MRR
// ARR
// ARPPU
// Activesubscriptions
// Newsubscriptions
// Subscriptionrenewalscancelled
// Expiredsubscriptions
// Activetrials
// Newtrials
// Trialrenewalcancelled
// Expiredtrials


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});