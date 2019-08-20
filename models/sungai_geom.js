module.exports = (sequelize, DataTypes) => sequelize.define('sungai_geom', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  featureId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
  idkecm: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValue: null,
  },
  idsung: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValue: null,
  },
  lat: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: null,
  },
  lng: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: null,
  },
  jenis_sungai: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValue: 1,
  },
  keterangan: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'sungai_geom',
});
