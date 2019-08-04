import db from '../dbSequelize';
import _ from 'lodash';
import response from './res';

import geojson from 'geojson';

import { 
	isFeatureIdExists,
	clearRiverByFeatureId, 
	generateInsertValues,
	insertRiverData,
	addRiverName,
	updateMasterRiver,
	generateFeatureWithoutProperty,
	insertRiverWithoutProperty,
	isIdExists,
	updateRiverProperty,
	queryProperti
} from '../helpers';


// test load data sungai_geom beserta attribut
exports.load = (req,res) => {

	const { 
		sungai_geom: model_sungai
	} = db.models

	const extract_fid_unik = async () => {
		try{			
			const result = await model_sungai.findAll();
			const uniqueResult = _.uniq(result.map(item=>item.featureId));
			return uniqueResult;
			// output [id1,id2,id3] 			
		}catch(err){
			console.log('error while get features data',err);
		}
	}

	const extract_kordinat = async (id) => {
		try{
			const kordinat = await model_sungai.findAll({ where:{ featureId:id }})
			// console.log(kordinat.dataValues.lng);
			const all = kordinat.map( coord=>{
				let item_kordinat = [];
				item_kordinat.push(coord.lng)
				item_kordinat.push(coord.lat)				
				return item_kordinat;
			});
			return all;
		}catch(err){}
	}

	const getAttribut = async (featureId) => {
		const q = `SELECT 
							a.idkecm,c.nmkecm,b.nmsung,a.jenis_sungai,a.keterangan,a.idsung
							FROM sungai_geom a
							INNER JOIN mst_sungai b on a.idsung=b.id 
							INNER JOIN mst_kecamatan c on a.idkecm=c.idkecm
							WHERE a.featureId=:featureId
							limit 1`;
		const attribut = await db.query(q, { replacements: { featureId: featureId }, type:db.QueryTypes.SELECT })
		//console.log(attribut);
		return attribut;
		
	}	

	const exec = async _ =>{		
		let unik = await extract_fid_unik();		
		const koord_master = []

		for (let i = 0; i < unik.length; i++) {
    	let featureId = unik[i]
			const koord_arr = []
    	let koord = await extract_kordinat(unik[i])
	    koord_arr.push(koord);	    

	    let prop = await getAttribut(unik[i])

			const obj = {};
			
			for (let j = 0; j < prop.length; j++) {
				
				obj['idkecm'] = prop[j].idkecm;
				obj['nmkecm'] = prop[j].nmkecm;
				obj['nmsung'] = prop[j].nmsung;
				obj['jenis_sungai'] = prop[j].jenis_sungai;
				obj['keterangan'] = prop[j].keterangan;
				obj['idsung'] = prop[j].idsung
			}

			obj['featureId'] = featureId;
			obj['line'] = koord_arr[0];

			koord_master.push(obj);
			if(unik.length === i + 1){
				// return obj;				
				return koord_master
			}
		}

		return koord_master
	
	}

	exec().then(featureUnik=>{		
		var result = geojson.parse(featureUnik, {'LineString': 'line'});
		response.ok(result.features, res);
	});
}

exports.loadAttributes = (req,res) => {
	
	const {
		sungai_geom
	} = db.models

	/*const featureId = req.params.featureId;
	const featureToRequest = sungai_geom.findOne({ where:{ featureId:featureId } });

	const q = `SELECT 
						a.idkecm,c.nmkecm,b.nmsung,a.jenis_sungai,a.keterangan
						FROM sungai_geom a
						INNER JOIN mst_sungai b on a.idsung=b.id 
						INNER JOIN mst_kecamatan c on a.idkecm=c.idkecm
						WHERE a.featureId=:featureId
						LIMIT 1`;

	db.query(q, { replacements: { featureId: featureId }, type:db.QueryTypes.SELECT })
	.then(result=>{

		if(result){			
			response.ok(result,res);
		}else{
			response.error(result,res);
		}
	})*/

	const idsung = req.params.idsung;
	const q = `SELECT 
						a.idkecm,c.nmkecm,b.nmsung,a.jenis_sungai,a.keterangan,a.idsung
						FROM sungai_geom a
						INNER JOIN mst_sungai b on a.idsung=b.id 
						INNER JOIN mst_kecamatan c on a.idkecm=c.idkecm
						WHERE a.idsung=:idsung
						LIMIT 1`;

	db.query(q, { replacements: { idsung: idsung }, type:db.QueryTypes.SELECT })
	.then(result=>{

		if(result){			
			response.ok(result,res);
		}else{
			response.error(result,res);
		}
	})	
}

exports.loadAttributesById = (req,res)=>{
	const {
		sungai_geom
	} = db.models

	const featureId = req.params.featureId;

	const findAttribute = async featureId => {
		
		const q = `SELECT 
						a.idkecm,c.nmkecm,b.nmsung,a.jenis_sungai,a.keterangan,a.idsung
						FROM sungai_geom a
						LEFT JOIN mst_sungai b on a.idsung=b.id 
						LEFT JOIN mst_kecamatan c on a.idkecm=c.idkecm
						WHERE a.featureId=:featureId
						LIMIT 1`;
		const result = db.query(q, { replacements: { featureId: featureId }, type:db.QueryTypes.SELECT });
		//const result = await sungai_geom.findOne({ where:{ featureId:featureId } });
		return result;
	}

	findAttribute(featureId).then(result=>{
		if(result){
			console.log(result)
			response.ok(result, res)
		}else{
			response.error(result, res)
		}
	});
	
	/*const q = `SELECT 
						a.idkecm,c.nmkecm,b.nmsung,a.jenis_sungai,a.keterangan
						FROM sungai_geom a
						INNER JOIN mst_sungai b on a.idsung=b.id 
						INNER JOIN mst_kecamatan c on a.idkecm=c.idkecm
						WHERE a.featureId=:featureId
						LIMIT 1`;

	db.query(q, { replacements: { featureId: featureId }, type:db.QueryTypes.SELECT })
	.then(result=>{

		if(result){			
			response.ok(result,res);
		}else{
			response.error(result,res);
		}
	})*/	
}

// mau ditambah function utk addRiver jika sungai nmsung_baru
exports.addNewRiver = (req,res) => {
	// fungsi ini hanya menyimpan koordinat saja tdk menyimpan properti sungai		
	// our async function
	const addNewRiver = async (data) => {
		// check first if data already isExists
		const id = req.body.data[0].id;
		const isDataExist = await isIdExists(id);
		if(isDataExist){
			const clearExistingId = await clearRiverByFeatureId(id);			
		}

		const values = await generateFeatureWithoutProperty(req.body.data);
		if(values.length > 0){
			const insert = await insertRiverWithoutProperty(values);
			return insert;
		}
	}

	addNewRiver(req.body.data).then(result=>{
		console.log('addNewRiver:',result)
		if(result){
			response.ok(result,res);
		}else{
			response.error(result,res);
		}
	})
}

exports.updateRiverPropertyCall = (req,res) => {
	// const { sungai_geom,mst_sungai } = db.models; 
	const featureId = req.body.featureId;
	const property = req.body.property;

	const updateAction = async (featureId,property) => {
		
		
		const isDataExist = await isIdExists(featureId);
		if(isDataExist){
			
			if(property.idsung === null || property.idsung === ""){

				const addNewRiverNameResult =  await addRiverName(property.sungai);
				console.log('addNewRiverNameResult:',addNewRiverNameResult);
				// const idsung = addNewRiverNameResult.dataValues.id;
				property['idsung'] = addNewRiverNameResult[0].dataValues.id;
				const updateResult = await updateRiverProperty(featureId, property); // property adalah nama parameter dari api			

				return updateResult;		
			}else{
				const updateResult = await updateRiverProperty(featureId, property); // property adalah nama parameter dari api				
				if(updateResult){
					const updatedMaster = await updateMasterRiver( property.idsung,property.sungai);
					return updatedMaster
				}
				// return updateResult;
			}
		}
	}
	
	updateAction(featureId,property).then(
		result=>{
			console.log(result);
			if(result){
					response.ok(result,res)				
			}else{
				response.error(result,res);
			}
		}
	);
}

exports.addRiver = (req,res) => {

	const { 
		sungai_geom 
	} = db.models;


	const features = req.body.features; // features dari komponen draw
	console.log(features);
	/*if(!features[0].properties.featureId){
		const featureId = features[0].id;
	}else{		
		const featureId = features[0].properties.featureId;
	}

	const properties = req.body.properties; // semua properti sungai dari state form > river
	
	const nmsung_lama = features[0].properties.nmsung;
	const nmsung_baru = properties.sungai;
	const idsung = properties.idsung;

	// old: features[0].properties.nmsung
	// update : properties.sungai
	 
	const addRiver = async (features) => {
		const isExists = await isFeatureIdExists(features); // cek di sungai_geom return featureId
		const clearData = await clearRiverByFeatureId(featureId); // hapus di sungai_geom
		if (isExists === featureId) {
			const values = await generateInsertValues(features, properties);

			if(values.length > 0){
				
				if(nmsung_lama !== nmsung_baru){
					if(idsung){
						// update nama sungai di master_sungai berdasarkan id sungai
						const updatedMaster = await updateMasterRiver(idsung,nmsung_baru);							
					}else{						
						const addRiverName = await addRiverName(nmsung);
					}
				}else{
					console.log('nama sungai tetap sama!')
				}

				const insertToDB = await insertRiverData(values);
				return insertToDB;
			}


		}  
	}

	addRiver(features).then(r=>{
		if(r){
			response.ok(r,res);
		}else{
			response.error(r,res);
		}
	});*/
}

exports.deleteRiver = (req,res) => {
	const featureId = req.body.featureId;
	const {
		mst_sungai,
		sungai_geom
	} = db.models

	const isFeatureIdExist = async (featureId) => {
		const data = await sungai_geom.findOne({ where:{ featureId:featureId } })
		const idsung = data.dataValues.idsung 		
		if (data.dataValues.featureId) {
		    return {
		    	featureId:data.dataValues.featureId,
		    	idsung:data.dataValues.idsung
		    }
		} else {
		    return false;
		}
			return false;
	}

	const doDeleteAction = async (featureId) => {

		const objekHapus = await isFeatureIdExist(featureId);
		// const featureId = objekHapus.featureId
		const idsung = objekHapus.idsung
		// console.log('objekHapus:',objekHapus);
		const deletedRiver = await sungai_geom.destroy({ where:{ featureId:featureId } }); // return berapa row yg dihapus
		const deletedRiverAttribute = await mst_sungai.destroy({ where:{ id:idsung } }); // return berapa row yg dihapus
		console.log('deletedRiver:',deletedRiver);
		console.log('deletedRiverAttribute:',deletedRiverAttribute);

		// if(deletedRiver > 0 && deletedRiverAttribute > 0){
		if(deletedRiver > 0){
			return true
		}else{
			return false
		}
		return false;
	}

	doDeleteAction(featureId).then(result=>{
		console.log('result',result);
		if(result){
			response.ok(result,res);
		}else{
			response.error(result,res);
		}
	})

	/*isFeatureIdExist(featureId).then(result=>{
		// console.log(result)
		if(result.featureId){
			const idsung = result.idsung;
			// console.log(featureId);
			// console.log(idsung);
			
		}
	})*/
}

// replace river shape (riverShape Page)
exports.queryProperti = (req,res) => {
	const { sungai_geom } = db.models;
	const featureId = req.params.featureId;

	// loop shape & delete 
	// find its id
	// save properti data 
	// delete by id
	// insert new shape
	const getProperti = async featureId => {

		// const id = featureId[0].properties.featureId
		try{
			const isDataExists = await isIdExists(featureId);
			// console.log(isDataExists);
			// if id exists
			// backup properti data
			if(isDataExists === featureId){
				const returnedProperti = await queryProperti(featureId);
				return returnedProperti;
			}

			return false;
			
		}catch(err){
			console.log(err.message)
		}
		// delete by id
	}

	getProperti(featureId).then(result=>{
		if(result){
			console.log('api sukses');
			response.ok(result,res);
		}else{
			console.log('api error');
			response.error(result,res);
		}
	});

}

exports.replaceMapRiver = (req,res) => {
	
	const { data } = req.body;	
	const properties = _.map(data,'properties');	
	
	const featureId = properties[0].featureId;
	const idkecm = properties[0].idkecm;
	const idsung = properties[0].idsung;
	const jenis_sungai = properties[0].jenis_sungai;
	const keterangan = properties[0].keterangan;	

	// geometry
	const geom = _.map(data,'geometry');

	const hapusDataLama = async featureId => {
		const hapusData = await clearRiverByFeatureId(featureId);
		return hapusData;
	}

	if (data.length > 0 ) {	

				hapusDataLama(featureId).then(result=>{

					// jika sukses hapus
					if(result > 0){
						// siap input baru lagi dgn perubahan						
						const coords = geom[0].coordinates;
						
						const values = []
						coords.map((item,i)=>{			
							console.log(item);
							values[i] = [featureId, idkecm, idsung, item[0], item[1], jenis_sungai, keterangan]
						});

						const q = `INSERT INTO sungai_geom (featureId,idkecm,idsung,lng,lat,jenis_sungai,keterangan) VALUES ?`;
						db.query(q, {
						    replacements: [values],
						    type: db.QueryTypes.INSERT
						}).then(result => {
						    if (result) {
						        response.ok({ messages: 'data is inserted successfully' }, res)
						    }
						});
						
					}
				});

	} 

}