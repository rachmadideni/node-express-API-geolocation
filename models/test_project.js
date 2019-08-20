module.exports = (sequelize, DataTypes) => sequelize.define('test_project', {
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
  geometry: {
    	type: DataTypes.GEOMETRY,
  },
  idMarker: {
    	type: DataTypes.INTEGER(11),
    	allowNull: true,
    defaultValue: 0,
  },
  progress: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
    defaultValues: 0,
  },
}, {
  indexes: [{
    unique: true,
    fields: ['featureId'],
  }],
  tableName: 'test_project',
});
