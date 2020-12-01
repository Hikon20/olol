// export table
module.exports = (dbinfo, Sequelize) => {
    // define:crée une table
    return dbinfo.define(
        //Nom de table 
        "tbl_atelier", {

            //field name
            id: {
                //set data type
                type: Sequelize.DataTypes.INTEGER,
                //set primerKey
                primaryKey: true,
                //autoIncrement can be used to create auto_incrementing integer columns
                autoIncrement: true

            },
            nom: {
                //texte de maximum 45 caractères
                type: Sequelize.DataTypes.STRING(45),
                //ne peux pas être nul ( coche NN)
                allowNull: false
            },


        }, {
            //option de la table, ne fais pas partie du bloc de la table
            //rajoute la date de création et la date de modification de la table
            timestamps: true,
            // permet de souligné le nom et de faire l'échange de clé étrangère 
            underscored: true
        }
    );
};