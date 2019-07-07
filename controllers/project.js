import db from '../dbSequelize';
import _ from 'lodash';
import response from './res';

import {
	isFeatureIdExists,
	clearProjectByFeatureId,
	generateInsertValues,
	insertProjectData
} from '../helpers/project'

exports.addProject = (req,res) => {
	const features = req.body.features;
	const properties = req.body.properties;
	const featureId = _.map(features,'id');

	const addProject = async features => {
		const isExists = await isFeatureIdExists(features);// return featureId jika featureid ada
		// const clearData = await clearProjectByFeatureId(featureId[0]); // hapus data sebelumnya
		// console.log('isExists:',isExists);
		// console.log('clearData:',clearData);

		if(isExists){
			// jika data sdh ada sebelumnya hapus data dan lakukan insert data
			if(isExists === featureId[0]){
				
				console.log(true)
				console.log(features);
				
				// extract kordinat
				const geom = _.map(features, 'geometry');
				const coord = geom[0].coordinates;				

				const {
					nampro,
					tglpro,
					ketera
				} = properties

				const q = `UPDATE project_geom SET nampro=?,ketera=?,lng=?,lat=? WHERE featureId=?`;
				db.query(q, { 
					replacements: [nampro, ketera, coord[0], coord[1], featureId[0]],
					type:db.QueryTypes.UPDATE
				}).then((err,result)=>{
					console.log(result)
				});				

			}
		}else{
			
			// jika null atau data belum ada maka insert data
			// generate / persiapkan data untuk diinput
			
			const values = await generateInsertValues(features,properties);
			if(values.length >0){
				const insertToDB = await insertProjectData(values);
				return insertToDB
			} 
		}

	}

	addProject(features).then(r=>{
		if(r){
			// console.log(r);
			response.ok(r,res);
		}else{
			response.error(r,res);
		}
	})
}

exports.loadAttributes = (req,res) => {
	const {
		project,
		upload
	} = db.models

	const featureId = req.params.featureId;
	// const featureToRequest = project.findOne({ where:{ featureId:featureId } });
	// console.log('featureToRequest:',featureToRequest);

	const q = `SELECT * FROM project_geom WHERE featureId=:featureId`;
	db.query(q, { replacements: { featureId: featureId }, type:db.QueryTypes.SELECT })
	.then(result=>{		
		if(result){			
			response.ok(result,res);
		}else{
			response.error(result,res);
		}
	});

}

exports.getUploadFiles = (req,res) => {
	const featureId = req.params.featureId;
	console.log(JSON.stringify(req.params.featureId));
	const q = `SELECT a.id,a.projectId,a.filename,a.url FROM dt_upload a 
						inner join project_geom b on a.projectId=b.id
						WHERE b.featureId=:featureId`;
	db.query(q, { replacements: { featureId: featureId }, type:db.QueryTypes.SELECT })
	.then( result => {	
		if(result){
			response.ok(result,res)
		}else{
			response.error(result,res)
		}		
	}).catch(err=>{
		console.log(err);
	})

}

exports.load = (req,res) => {
	const {
		project
	} = db.models

	// ambil data project & masukkan sbg item array features
	const getProjectData = async () => {
		try{
			const projects = await project.findAll();
			return projects;
		}catch(err){
			console.log('erro getProjectData:',err);
		}
	}

	getProjectData().then(result=>{
			
		if(result.length > 0){
				
				const lastItem = result.length;
				const features = [];
				
				result.map( (item,index)=>{			
					const featureId = item.dataValues.featureId;
					const nampro = item.dataValues.nampro;
					const tglpro = item.dataValues.tglpro;
					const ketera = item.dataValues.ketera;
					const lng = item.dataValues.lng;
					const lat = item.dataValues.lat;

					const obj = {}
					const geom = {}
					const properties = {}
					
					obj['type'] = 'Feature'
					obj['id'] = featureId;
					geom['type'] = 'Point'
					geom['coordinates'] = [lng,lat]
					obj['geometry'] = geom;
					obj['properties'] = { featureId,nampro,tglpro,ketera }
					features.push(obj);	
					if(lastItem === index + 1){
						response.ok(features,res)						
					}
				});

		}else{
			response.error(null,res);
		}
	})

}