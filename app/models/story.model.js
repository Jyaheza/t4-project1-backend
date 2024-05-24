module.exports = (sequelize, Sequelize) => {
    const Story = sequelize.define("story", {
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