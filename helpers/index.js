import db from '../dbSequelize';
import _ from 'lodash';

const { 
	mst_sungai,
	sungai_geom } = db.models;


// check for river  
const isRiverExists = async (idsung) => {
	try{
		const result = await mst_sungai.findOne({ where:{ id:idsung }});
		if(result){
			return result.dataValues.id;
		}
		return result;
	}catch(err){
		console.log(err);
	}
}

const generateInsertValues = async (features, properties) => {
		
		// extract id, coordinates
		const featureId = _.map(features, 'id');
		const geom = _.map(features, 'geometry');
		const coord = geom[0].coordinates;		

		// extract properties
		const nmsung = properties.sungai;
		const idsung_state = properties.idsung;
		const idkecm = properties.kecamatan;		
		const jenis_sungai = properties.jenis_sungai;
		const keterangan = properties.keterangan;

		// get river id 
		const idsung = await isRiverExists(idsung_state);		

		const values = [];
		if (geom[0].type === 'LineString') {
			for (var i = 0; i < coord.length; i++) {
			   values[i] = [
			   		featureId[0], 
			   		idkecm, 
			   		idsung, 
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
					values[j] = [featureId[0], idkecm, idsung, coord[i][j], coord[i][j], jenis_sungai, keterangan];								
				}
			}
		}

		return values;
		// end generateInsertValues
}


// insert feature without property
const generateFeatureWithoutProperty = async (features) => {
	console.log('generateFeatureWithoutProperty:',features);
	const featureId = _.map(features, 'id');
	const geom = features[0].geometry;
	const coord = geom.coordinates;
	const values = [];	
	if (geom.type === 'LineString') {
		for (var i = 0; i < coord.length; i++) {
		   values[i] = [
		   		featureId[0], 		   		 
		   		coord[i][0], 
		   		coord[i][1]
		   	]
		}
	}else{
		// multi line string
		for (var i = 0; i < coord.length; i++) {
			for(var j = 0; j < coord[i].length; j++ ){		
				values[j] = [featureId[0], coord[i][j], coord[i][j]];
			}
		}
	}

		return values;
}

// DANGEROUS
const clearRiverByFeatureId = async (featureId) => {
	const result = await sungai_geom.destroy({
		where:{ featureId:featureId }
	});
	return result; // return The number of destroyed rows

}

const isFeatureIdExists = async (features) => {

	// const featureId = _.map(features, 'id');	
	// console.log('featureId:',features[0].properties.featureId);		
	try{
		const featureId = features[0].properties.featureId;
		if(featureId){
				const result = await sungai_geom.findOne({
					where: { featureId:featureId }
				});

				if(result){
					return result.dataValues.featureId;
				}			
		}
		return null;
	}catch(err){
		throw err;
	}
}

const isIdExists = async (id) => {
	try{
			const result = await sungai_geom.findOne({
				where: { featureId:id }
			});

			if(result){
				return result.dataValues.featureId;
			}			
		
		return null;
	}catch(err){
		throw err;
	}	
}

const insertRiverData = async (values) => {
	const q = `INSERT INTO sungai_geom (featureId, idkecm, idsung, lng, lat, jenis_sungai, keterangan) VALUES ?`;
	const result = await db.query(q, { replacements: [values], type: db.QueryTypes.INSERT });
	return result;
}

const insertRiverWithoutProperty = async values=> {
	const q = `INSERT INTO sungai_geom (featureId, lng, lat ) VALUES ?`;
	const result = await db.query(q, { replacements: [values], type: db.QueryTypes.INSERT });
	return result;	
}

const updateRiverProperty = async (featureId,property) => {
	
	// const idkecm = property.idkecm;
	// const idsung = property.idsung;
	// const nmsung = property.sungai;
	// const jenis_sungai = property.jenis_sungai;
	// const keterangan = property.keterangan;	

	/*const q = `UPDATE sungai_geom SET idkecm=:idkecm,idsung=:idsung,jenis_sungai=:jenis_sungai,keterangan=:keterangan WHERE featureId=:featureId`
	const result = await db.query(q, { replacements: { 
		idkecm:idkecm,
		idsung:idsung,
		jenis_sungai:jenis_sungai,
		keterangan:keterangan,
		featureId:featureId 
	} , type: db.QueryTypes.UPDATE });
	return result;*/
	console.log('property:',property);
	// return property;
	// filter hanya row yg tdk null yg diupdate

	const getFieldsToUpdate = (fields) => {
		// console.log('fields:',fields);
		// console.log(process.version)
			const { kecamatan, idsung, jenis_sungai, keterangan } = fields;
			const obj = {
				idkecm:kecamatan,
				idsung:idsung,
				jenis_sungai:jenis_sungai,
				keterangan:keterangan
			}
		return obj;
		// return {
		// 	...kecamatan && { idkecm: kecamatan },
		// 	...idsung && { idsung: idsung },
		// 	// ...fields.sungai && { nmsung: fields.sungai },
		// 	...jenis_sungai && { jenis_sungai: jenis_sungai },
		// 	...keterangan && { keterangan: keterangan }
		// }
	};

	const fieldsToUpdate = getFieldsToUpdate(property);

	return await sungai_geom.update(fieldsToUpdate,{ where:{ featureId: featureId } });

	// if(property.idsung){
	// 	// klo sdh ada idsung berarti master sungai sdh ada  
	// 	// update sungai_geom
	// 	// sungai_geom.create({})
	// 	const updateMasterSungai = await mst_sungai.update({ nmsung:nmsung }, where: { id: idsung });

	// }else{
	// 	// klo tdk ada	
	// 	// update sungai_geom
	// 	// insert mst_sungai
	// 	const insertMasterSungai = await mst_sungai.create({ nmsung:nmsung });
	// 	const updateSungaiGeom = await sungai_geom.update({ },where:{ featureId:featureId });
	// 	console.log(updateSungaiGeom);
	// 	/*if(insertMasterSungai && updateSungaiGeom){
	// 		return true
	// 	}*/

	// }

	// return false;
}

const addRiverName = async (riverName) => {
	const result = await mst_sungai.findOrCreate({ where:{ nmsung:riverName } })
	return result;
}

const updateMasterRiver = async (idsung,nmsung_baru) => {
	const result = mst_sungai.upsert({
		id:idsung,
		nmsung:nmsung_baru
	});
	console.log('updateMasterRiver:', result);
	return result;
}

const queryProperti = async id => {
	
	const result = await sungai_geom.findOne({ 
		attributes:['idkecm','idsung','jenis_sungai','keterangan'],
		where: { 
			featureId:id 
		} 
	});
	console.log('queryProperti :', result);
	return result.dataValues;
}

export {  
	generateInsertValues,
	isFeatureIdExists,
	insertRiverData,
	clearRiverByFeatureId,
	addRiverName,
	updateMasterRiver,	
	generateFeatureWithoutProperty,
	insertRiverWithoutProperty,
	isIdExists,
	updateRiverProperty,
	queryProperti
}