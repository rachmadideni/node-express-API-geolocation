module.exports = (sequelize, DataTypes) => {
	return sequelize.define('mst_sungai',{
		id:{
			type:DataTypes.INTEGER(11),
			allowNull:false,
			primaryKey:true,
			autoIncrement:true
		},
		nmsung:{
			type:DataTypes.STRING(255),
			allowNull:false
		}
	},{
		tableName:'mst_sungai'
	})
}