import db from '../dbSequelize';
import _ from 'lodash';
import response from './res';

import { 
	isFeatureIdExists,
	clearRiverByFeatureId, 
	generateInsertValues,
	insertRiverData } from '../helpers';

exports.load = (req,res) => {
	const {
		sungai_geom:riverMdl
	} = db.models

	const getUniqueFeatures = async () => {
		try{			
			const result = await riverMdl.findAll();
			const uniqueResult = _.uniq(result.map(item=>item.featureId));
			console.log(uniqueResult);
			return uniqueResult;			
		}catch(err){
			console.log('error while get features data',err);
		}
	}

	// get array of coordinates from each features
	const getCoordinatesFromFeatures = async (featureId,index) => {
		try{
			const coordinates = await riverMdl.findAll({ where:{ featureId:featureId }})
			const coordItem = coordinates.map(coord=>{
				let item = []
				item.push(coord.lng);
				item.push(coord.lat);
				return item;
			});
			return coordItem;
			
		}catch(err){
			console.log('error while getting coordinates data',err);	
		}
	}

	getUniqueFeatures()
	.then(result=>{
		// console.log('result:',result)
		const uniqueLength = result.length
		const features = [];
		result.map((featureId,index)=>{
				
			getCoordinatesFromFeatures(featureId,index).then(result => {

				let obj = {}
				let geom = {}
				let properties = {}
				obj['type'] = 'Feature'
				obj['id'] = featureId;
				geom['type'] = 'LineString'
				geom['coordinates'] = result
				obj['geometry'] = geom;
				obj['properties'] = { featureId }
				return obj;
			}).then(result2=>{				
				features.push(result2)
				return features;
			}).then(result3=>{
				// console.log(result3);
				// console.log(index)
				// console.log(uniqueLength)
				// last
				if(uniqueLength === index + 1){
					// console.log(features);
					return res.status(200).json(features);
				}
			})			
		});
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

	const doDelete = async (featureId) => {
		// const deletedRiver = await sungai_geom.destroy({ where:{ featureId:featureId } });
		const deletedId = await sungai_geom.findOne({ where:{ featureId:featureId } })
		console.log(deletedId)
	}

	doDelete(featureId).then(result=>{
		console.log(result)
	})
	

}