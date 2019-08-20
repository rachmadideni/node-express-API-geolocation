module.exports = (sequelize, DataTypes) => sequelize.define('project', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  featureId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  nampro: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tglpro: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ketera: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lat: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  lng: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
}, {
  tableName: 'project_geom',
});
