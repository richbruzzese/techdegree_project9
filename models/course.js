'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"title" is required'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"description" is required'
        }
      }
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  Course.associate = (models) =>{
    Course.belongsTo(models.User,{
        as: 'student',
        foreignKey:{
            fieldName: 'userId',
            allowNull: false
        }
    })
}
  return Course;
};