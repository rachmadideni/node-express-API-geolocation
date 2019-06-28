module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user',{
		iduser:{
			type:DataTypes.INTEGER(11),
			allowNull:false,
			primaryKey:true,
			autoIncrement:true
		},
		usernm:{
			type:DataTypes.STRING(255),
			allowNull:false
		},
		passwd:{
			type:DataTypes.STRING(255),
			allowNull:false
		},
		user_category:{
			type: DataTypes.ENUM('1','2'),
      allowNull: false,
      defaultValue: '2'
		},
		status:{
			type: DataTypes.ENUM('Y','T'),
      allowNull: true,
      defaultValue: 'T'
		}
	},{
		tableName: 'dt_user'
	})
}