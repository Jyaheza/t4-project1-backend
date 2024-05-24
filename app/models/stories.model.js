module.exports = (sequelize, Sequelize) => {
    const Story = sequelize.define("story", {
        storyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        story: {
            type: Sequelize.TEXT,
            allowNull: false,
        },

        parentId: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });

    return Story;
};