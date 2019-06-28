import express from 'express';
import multer from 'multer';
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
	console.log('upload:',req.file);
})


module.exports = router