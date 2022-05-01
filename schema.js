
const db = require("./model");
module.exports ={
        
    appName: {
        type: db.Sequelize.STRING,
      
    },
    BillingIssues: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    Refundevents: {
        type: db.Sequelize.INTEGER,
       allowNull: false,
        defaultValue: 0
    },
    RefundMoney: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    MRR: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ARR: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ARRPPU: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ActiveSubscribers: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    NewSubscribers: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    Subcriptionrenewalscancelled: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    expiredsubcriptions: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    activeTrials: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    newTrials: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    trialrenewalscancelled: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    expiredtrials: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
  

    
};