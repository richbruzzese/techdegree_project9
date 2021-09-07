'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"firstName" is required'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '"lastName" is required'
        }
      }
    },
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) =>{
      User.hasMany(models.Course,{
          as: 'student',
          foreignKey:{
              fieldName: 'userId',
              allowNull: false
          }
      })
  }
  return User;
};