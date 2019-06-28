import multer from 'multer';

const storage = multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,'uploads/')
	},
	filename:function(req,file,callback){
		const ext = file.mimetype.split("/")[1];
		// str.split("/")[1];
		callback(null,file.fieldname + '_' + Date.now() + '.' + ext)
	}
})
const upload = multer({ storage:storage });

module.exports = app => {
    // TEST ROUTES
    // const test = require('../controllers');
    // app.route('/').get(test.index);

    // auth
    const auth = require('../controllers/auth');
    app.route('/api/auth/signin').post(auth.signin);

    // import geojson data to mysql    
    const geojson = require('../controllers/geojson');
    app.route('/api/geojson/import').post(geojson.import);

    // options 
    // (master kecamatan)
    const options = require('../controllers/options')
    app.route('/api/options/:optionKey').get(options.kecamatan);

    // load river
    const river = require('../controllers/river');
    app.route('/api/geojson/load/river').get(river.load);

    // get river attributes    
    app.route('/api/geojson/sungai/attribut/:featureId').get(river.loadAttributes);
    app.route('/api/geojson/sungai/add').post(river.addRiver);
    app.route('/api/geojson/sungai/hapus').post(river.deleteRiver);
    

    // upload json
    // app.route('/api/geojson/upload').post(geojson.upload,upload.single('data'));

    
}