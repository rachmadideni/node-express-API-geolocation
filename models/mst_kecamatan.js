/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mst_kecamatan', {
    idkecm: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement:true
    },
    nmkecm: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'mst_kecamatan'
  });
};
