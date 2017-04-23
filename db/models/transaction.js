module.exports = function(sequelize, dataTypes)
{
    var transaction = sequelize.define('transaction',
    {
        id:
        {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount:
        {
            type: dataTypes.REAL,
            allowNull: false
        },
        currency:
        {
            type: dataTypes.TEXT,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        underscored: true,
        tableName: 'transactions'
    })

    return transaction
}
