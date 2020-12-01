module.exports = (dbinfo, Sequelize) => {
    return dbinfo.define(
        "tbl_emp", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nom: {
                type: Sequelize.DataTypes.STRING(45)
            },
            prenom: {
                type: Sequelize.DataTypes.STRING(45)
            },
            email: {
                type: Sequelize.DataTypes.STRING(100)
            },
            password: {
                type: Sequelize.DataTypes.STRING
            }
        }, {
            timestamps: true,
            underscored: true
        }
    )
}