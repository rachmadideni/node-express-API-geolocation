/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shape_upload', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tguplo:{
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },   
    shape_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'shape_upload'
  });
};
