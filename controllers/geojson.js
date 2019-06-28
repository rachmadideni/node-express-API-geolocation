import db from '../dbSequelize';
import _ from 'lodash';
import response from './res';

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