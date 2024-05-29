module.exports = (sequelize, Sequelize) => {
    const Story = sequelize.define("story", {
        storyId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        story: {
            type: Sequelize.TEXT,
            allowNull: false,
        },

        parentId: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    });

    return Story;
};