import db from '../dbSequelize';
import _ from 'lodash';
import response from './res';

import geojson from 'geojson';

import { 
	isFeatureIdExists,
	clearRiverByFeatureId, 
	generateInsertValues,
	insertRiverData } from '../helpers';



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
							a.idkecm,c.nmkecm,b.nmsung,a.jenis_sungai,a.keterangan
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

	const featureId = req.params.featureId;
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
		// console.log(result);
		if(result){			
			response.ok(result,res);
		}else{
			response.error(result,res);
		}
	})

}

exports.addRiver = (req,res) => {

	const { sungai_geom } = db.models;

	const features = req.body.features;
	const properties = req.body.properties;
	const featureId = _.map(features,'id');

	const addRiver = async (features) => {
		const isExists = await isFeatureIdExists(features);		
		const clearData = await clearRiverByFeatureId(featureId[0]);
		if (isExists === featureId[0]) {
			const values = await generateInsertValues(features, properties);
			if(values.length > 0){
				const insertToDB = await insertRiverData(values);
				return insertToDB;
			}
			// console.log(insertToDB);
		}  
	}

	addRiver(features).then(r=>{
		if(r){
			response.ok(r,res);
		}else{
			response.error(r,res);
		}
	});

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

		if(deletedRiver > 0 && deletedRiverAttribute > 0){
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