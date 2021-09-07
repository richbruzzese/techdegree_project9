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
      allowNull:false,
      validate: {
        notNull: {
          msg: 'Title is required'
        },
        notEmpty: {
          msg: 'Provide a valid title'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Description must be provided"
        },
        notEmpty: {
          msg: 'Provide a valid description'
        }
      }
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Course',
  });
  Course.associate = (models) =>{
    Course.belongsTo(models.User,{
        as: 'student',
        foreignKey:{
            fieldName: 'userId'
        }
    })
}
  return Course;
};