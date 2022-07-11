module.exports = (sequelize, DataTypes) => {
    const history = sequelize.define("history", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        word_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    }, {
        freezeTableName: true
    });

    history.associate = (models) => {
        history.belongsTo(models.word, {
            foreignKey: "word_id",
        });

        history.belongsTo(models.user, {
            foreignKey: "user_id",
        });
    };

    return history;
}