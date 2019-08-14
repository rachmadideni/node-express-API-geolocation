module.exports = (sequelize,DataTypes) => {
	return sequelize.define('test_project',{
		id:{
			type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
		},
		featureId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
		nampro:{
			type: DataTypes.STRING(255),
      allowNull: true
		},
    tglpro: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ketera: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    geometry:{
    	type: DataTypes.GEOMETRY
    },
    idMarker:{
    	type:DataTypes.INTEGER(11),
    	allowNull:true
    }
	},{
    indexes:[{
      unique:true,
      fields:['featureId']
    }],
    tableName: 'test_project'
  })
}