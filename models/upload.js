/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('upload', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    iduplo: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    tguplo: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'dt_upload',
  });
};
