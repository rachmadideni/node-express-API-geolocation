module.exports = (sequelize, DataTypes) => sequelize.define('tipe_marker', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_marker: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nama_icon: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'mst_tipe_marker',
});
