/** Start Require module ***/
/**
 * Sequelize is a promise-based ORM for Node.js.
 * Sequelize is easy to learn and has dozens of cool features like synchronization, association, validation, etc.
 * It also has support for PostgreSQL, MySQL, MariaDB, SQLite, and MSSQL.
 * I am assuming you have some form of SQL database service started on your machine. I am currently using MySQL.
 * */
/**Toujours mettre les require en tete sinon ils ne seront pas pris en compte */


// Sequelize est un ORM
// ORM : Un mapping objet-relationnel 
// est un type de programme informatique qui se place en interface 
//entre un programme applicatif et une base de données relationnelle 
//pour simuler une base de données orientée objet.
//ORM :signifie Object-Relational Mapping. Un ORM est un ensemble de classes (tables) permettant de manipuler les tables d’une base de données relationnelle comme s’il s’agissait d’objets.
const Sequelize = require('sequelize');
/*Connection à la base de données avec la const dbinfo (instance)*/
const db = {};
//new Sequelize = instance = connection
const dbinfo = new Sequelize("test", "root", "", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    /*pool: nombre de connections*/
    pool: {
        max: 5,
        min: 0,
    }
});
//vérification connexion
dbinfo.authenticate()
    .then(() => {
        console.log('connection to db')
    })
    // attrap l'erreur et la précise
    .catch(err => {
        console.error('unable to connect to the database:' + err);
    });

/** end connexion to database **
 */

//models/tables

// Start Require models/tables **
// require every table in database
//we need it in this file to make  associations
//we all so require the associations table we make , 
//we need some data in that table

db.atelier = require('../models/Atelier')(dbinfo, Sequelize);
db.garage = require('../models/Garage')(dbinfo, Sequelize);
db.client = require('../models/Client')(dbinfo, Sequelize);
db.voiture = require('../models/Voiture')(dbinfo, Sequelize);
db.emp = require('../models/Emp')(dbinfo, Sequelize);

/* There are four type of associations available in Sequelize
 *
 * BelongsTo     :  associations are associations where the foreign key for the one-to-one relation exists on the source model.
 * HasOne        :  associations are associations where the foreign key for the one-to-one relation exists on the target model.
 * HasMany       :  associations are connecting one source with multiple targets. The targets however are again connected to exactly one specific source.
 * BelongsToMany :  associations are used to connect sources with multiple targets. Furthermore the targets can also have connections to multiple sources.
 *
 ** Start Relation **
 ***
 *
 *  the garage can have Many atelier : atelier: 1,1  garage : 1,N
 */
db.garage.hasMany(db.atelier, { foreignKey: "garageId" });
db.client.hasMany(db.voiture, { foreignKey: "clientId" });
db.voiture.belongsTo(db.client, { foreignKey: "clientId" });
//référence à l'instance de la base de données
db.dbinfo = dbinfo;
// ORM qui relis le code à la base de données
db.Sequelize = Sequelize;

//Sync all defined models to the DB.
// similar for sync: you can define this to always force sync for models
// Synchronisez tous les modèles définis avec la base de données.
// Similaire pour la synchronisation: vous pouvez définir ceci pour toujours forcer la synchronisation pour les modèles 

//dbinfo.sync({ force: true });

// The module.exports or exports is a special object which is included in every JS file in the Node.js application by default.
//module is a variable that represents current module and exports is an object that will be exposed as a module.
//So, whatever you assign to module.exports or exports, will be exposed as a module.*/
module.exports = db;