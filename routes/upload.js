import express from 'express';
import multer from 'multer';
import db from '../dbSequelize';
import response from '../controllers/res';
const router = express.Router();

const storage = multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,'uploads/')
	},
	filename:function(req,file,callback){
		const ext = file.mimetype.split("/")[1];	
		callback(null,file.fieldname + '_' + Date.now() + '.' + ext)
	}
})
const upload = multer({ storage:storage });

router.post('/upload',upload.single('data'),(req,res,next)=>{
	console.log('req body:', req.body);
	console.log('req file:', req.file);
})

// upload file/gambar project
router.post('/project/upload',upload.single('project'),(req,res,next)=>{
	// console.log('req body project :', req.body.project);
	// console.log('req file:', req.file);

	console.log('\n===body', req.body);
	console.log('\n===params', req.params);
	console.log('\n===file', req.file);

	const file = req.file;
	if(!file){
		const error = new Error('please upload file');
		error.httpStatusCode = 400
		return next(error);
	}

	const { upload:uploadModel } = db.models
	const filename = req.file.filename;
	const url = req.file.destination + '' + filename;
	const projectId = req.body.projectId;

	uploadModel.create({
		projectId,
		iduplo:1,
		tguplo: new Date(),
		fileName:filename,
		url
	}).then(result=>{
		console.log(result);
		if(result){
			response.ok(result,res)
		}else{
			response.error(result,res);
		}
	})

});


module.exports = router