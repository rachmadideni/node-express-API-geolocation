import db from '../dbSequelize';
import response from './res';
import fs from 'fs';
import path from 'path';
// import JSZip from 'jszip'; 
import AdmZip from 'adm-zip';

exports.index = (req, res) => {
    response.ok('hello from routes', res);
}

exports.makezip = (req,res) => {
	
	const zip = new AdmZip();

	const uploadsPath = path.join(__dirname, '../uploads');

	// read contents from upload dir
	fs.readdir(uploadsPath,(err,files)=>{
		if(err){			
			response.error(err,res);
		}		
		
		files.forEach(file=> {
			if (file.slice(-3) === 'png' && file.startsWith('project')) {
				zip.addLocalFile(`${uploadsPath}/${file}`);
			}			
		});
		
		// const send = zip.toBuffer();
		zip.writeZip(`${uploadsPath}/contoh.zip`);
		response.ok('sukses',res);					

	});
}