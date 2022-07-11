module.exports = (sequelize, DataTypes) => {
    const word = sequelize.define("word", {
        eng: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        thai: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    word.associate = (models) => {
        word.hasMany(models.history, {
            foreignKey: "word_id",
        });
    };

    return word;
}