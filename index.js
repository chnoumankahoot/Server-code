const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();


const datastructure = require("./schema");

app.use(cors());

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
//route to get all the tables from the database
app.get("/gettables", (req, res) => {
    
    db.query("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'meterics'", {
        type: db.QueryTypes.SELECT
        })
        .then(tables => {
            let arr=[];
            tables.forEach(table => {
                db.query("SELECT * FROM "+"meterics."+table.TABLE_NAME, {
                    type: db.QueryTypes.SELECT
                    })
                    
                    .then(data => {
                        console.log(data[0])
                        arr.push(data[0])
                        if(arr.length==tables.length){
                            res.json(arr)
                        }
                    }
                )

            }
            );
           
        }
        );
}
);

app.post('/newApp', async(req, res) => {
    console.log(req.body);
    //define new table in db with strings
    try{
    const Usermodel=await db.define(req.body.appName,datastructure,{timestamps:false,tableName:req.body.appName});
        
     await db.sync({force:true});
     
     Usermodel.build({
        appName: req.body.appName,
        BillingIssues: 0,
        Refundevents: 0,
        RefundMoney: 0,
        MRR: 0,
        ARR: 0,
        ARRPPU: 0,
        ActiveSubscribers: 0,
        NewSubscribers: 0,
        Subcriptionrenewalscancelled: 0,
        expiredsubcriptions: 0,
        activeTrials: 0
    }).save();

    res.send(Usermodel.tableName+" table created successfully");
     

    //assign default values to new table
    
        
    
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
//get email count from the database if counter table exists
app.get('/getEmailCount', async(req, res) => {
    try{
    
     let app = await db.query(`SELECT * FROM meterics.counter`);

    res.send(app[0][0]);
    
}
catch(err){
    res.send(err);

    }
}
)
//update email count in the database if counter table exists
app.post('/updateEmailCount', async(req, res) => {
    try{
        
      
        await db.query(`UPDATE counter SET emailCount=emailCount+1`);
        db.sync().then(async() => {
            console.log("Data updated successfully.");
            res.json({message:"Data updated successfully"});
        });
    }
    catch(err){
        res.send(err);
    }
}
)
//update pushnotification count in the database if counter table exists
app.post('/updatePush', async(req, res) => {
    try
    {
       
      
        await db.query(`UPDATE counter SET pushCount=pushCount+1`);
        db.sync().then(async() => {
            console.log("Data updated successfully.");
            res.json({message:"Data updated successfully"});
        });
    }
    catch(err){
        res.send(err);
    }
}
)
        


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