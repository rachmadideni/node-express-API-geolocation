import db from '../dbSequelize';
import _ from 'lodash';

const { 
	mst_sungai,
	sungai_geom } = db.models;

const isRiverExists = async (nmsung) => {
	try{
		const result = await mst_sungai.findOne({ where:{ nmsung:nmsung }});
		const idsung = result.dataValues.id;
		return idsung;
	}catch(err){
		console.log(err);
	}
}

const generateInsertValues = async (features, properties) => {
		
		const featureId = _.map(features, 'id');
		const geom = _.map(features, 'geometry');
		const coord = geom[0].coordinates;		

		const nmsung = properties.sungai;
		const idkecm = properties.kecamatan;
		const jenis_sungai = properties.jenis_sungai;
		const keterangan = properties.keterangan;

		const idsung = await isRiverExists(nmsung);

		const values = [];
		if (geom[0].type === 'LineString') {
			for (var i = 0; i < coord.length; i++) {
			   values[i] = [
			   		featureId[0], 
			   		idsung, 
			   		idkecm, 
			   		coord[i][0], 
			   		coord[i][1], 
			   		jenis_sungai, 
			   		keterangan
			   	]
			}
		}else{
			// multi line string
			for (var i = 0; i < coord.length; i++) {
				for(var j = 0; j < coord[i].length; j++ ){		
					values[j] = [featureId[0], idsung, idkecm, coord[i][j], coord[i][j], jenis_sungai, keterangan];								
				}
			}
		}

		return values;
		// end generateInsertValues
}

// DANGEROUS
const clearRiverByFeatureId = async (featureId) => {
	const result = await sungai_geom.destroy({
		where:{ featureId:featureId }
	});
	return result; // return The number of destroyed rows

}

const isFeatureIdExists = async (features) => {

	const featureId = _.map(features, 'id');
	const result = await sungai_geom.findOne({
		where: { featureId:featureId }
	});

	if(result){		
		return result.dataValues.featureId;
	}
	return result;
}

const insertRiverData = async (values) => {
	const q = `INSERT INTO sungai_geom (featureId, idkecm, idsung, lng, lat, jenis_sungai, keterangan) VALUES ?`;
	const result = await db.query(q, { replacements: [values], type: db.QueryTypes.INSERT });
	return result;
}

const addRiverName = async (riverName) => {
	const result = await sungai_geom.findOrCreate({ where:{ nmsung:riverName } })
	return result;
}
export {  
	generateInsertValues,
	isFeatureIdExists,
	insertRiverData,
	clearRiverByFeatureId,
	addRiverName
}