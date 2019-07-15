import db from '../dbSequelize';
import _ from 'lodash';
import response from './res';
import fs from 'fs'
import geojson from 'geojson';
import path from 'path'
// import express from 'express';
// const router = express.Router();

exports.import = (req,res) => {
	
	const { 
		data } = req.body;
	
	const { 
		sungai_geom:sg,
		mst_sungai } = db.models

	const obj = JSON.parse(data);
	const features = obj.features;
	const properties = _.map(features,'properties');	
	
	// properties
	const featureId = properties[0].featureId;
	const idkecm = properties[0].idkecm;
	const idsung = properties[0].idsung;
	const keterangan = properties[0].keterangan;

	// geometry
	const geom = _.map(features,'geometry');	

	if (features.length > 0 && features.length < 2) {
		
		const coords = geom[0].coordinates;
		const coord = coords[0];
		
		const values = []
		coord.map((item,i)=>{			
			values[i] = [featureId,idkecm,idsung,item[0],item[1],keterangan]
		});

		const q = `INSERT INTO sungai_geom (featureId,idkecm,idsung,lng,lat,keterangan) VALUES ?`;
		db.query(q, {
		    replacements: [values],
		    type: db.QueryTypes.INSERT
		}).then(result => {
		    if (result) {
		        response.ok({ messages: 'data is inserted successfully' }, res)
		    }
		});
	}

}

exports.exportFile = (req,res) => {

	const filename = req.params.filename;
	const { sungai_geom,project } = db.models;

	const getIdUnik = async () => {
		try{			
			const result = await sungai_geom.findAll();
			const uniqueResult = _.uniq(result.map(item=>item.featureId));
			return uniqueResult;
		}catch(err){
			console.log('error while get features data',err);
		}
	}

	const getKordinat = async (id) => {
		try{
			const kordinat = await sungai_geom.findAll({ where:{ featureId:id }})
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
		let unik = await getIdUnik();		
		const koord_master = []

		for (let i = 0; i < unik.length; i++) {
    	let featureId = unik[i]
			const koord_arr = []
    	let koord = await getKordinat(unik[i])
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

	exec().then(result=>{
		//console.log('exec1:',result);
		return result;// sungai		
	});


	const getProjectData = async () => {
		try{
			const projects = await project.findAll();
			return projects;
		}catch(err){
			console.log('erro getProjectData:',err);
		}
	}

	const getPoint = async () => {
		try{
			const points = await project.findAll();
			const features = [];
			points.map((item,index)=>{
				const obj = {}
				obj['lng'] = item.dataValues.lng;
				obj['lat'] = item.dataValues.lat;
				obj['featureId'] = item.dataValues.featureId;
				obj['nampro'] = item.dataValues.nampro;
				obj['tglpro'] = item.dataValues.tglpro;
				obj['ketera'] = item.dataValues.ketera;
				features.push(obj)
			})

			return features;

		}catch(err){

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
						return features;						
					}
				});

				return features;
				// console.log(features);
		}
	});

	// array project
	const exec2 = async _ =>{
		const allPoint = await getPoint();
		return allPoint;
	}

	exec2().then(result=>{
		//console.log('exec2:',result)
		return result;// project		
	});

	const combine = async () => {		
		const sungai = await exec();
		const project = await exec2();
		const combined = sungai.concat(project);
		return combined;
	}

	combine().then(result=>{
		const combined = geojson.parse(result, {'Point':['lat','lng'], 'LineString': 'line'});
		// const parsed = JSON.parse(combined);
		const stringify = JSON.stringify(combined);		
		const fileLocation = path.join('./uploads', filename + '.json');
		fs.writeFile(fileLocation, stringify, 'utf8', err=>{
			if(err){
				console.log(err)
			}

			// res.download
			response.ok(`${filename}.json`,res);
			// console.log('json sdh disimpan ke file')

		})
		// console.log('combine:',combined) 
		// response.ok(combined,res);
		// response.ok(result.features, res);
	});


	/*
	harus disediakan [{}]

	const contoh = [{
		x:,
		y:,
		prop1:
		prop1:
	},{
		x:,
		y:,
		prop1:
		prop1:
	},{
		line:[[]],
		prop1:
		prop2:
	}]


	 */


}