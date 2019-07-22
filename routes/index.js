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
    app.route('/api/auth/signin').post(auth.signin); // added to postman

    // import geojson (only river data) to mysql    
    const geojson = require('../controllers/geojson');
    app.route('/api/geojson/import').post(geojson.import); // added to postman

    // options 
    // (master kecamatan)
    const options = require('../controllers/options')
    app.route('/api/options/:optionKey').get(options.kecamatan); // added to postman

    // load river
    const river = require('../controllers/river');
    app.route('/api/geojson/load/river').get(river.load); // added to postman


    // get river attributes    
    app.route('/api/geojson/sungai/attribut/:idsung').get(river.loadAttributes); // added to postman
    app.route('/api/geojson/sungai/add').post(river.addRiver); // added to postman
    app.route('/api/geojson/sungai/hapus').post(river.deleteRiver); // added to postman

    // tambah sungai baru
    app.route('/api/geojson/sungai/addNew').post(river.addNewRiver);
    app.route('/api/geojson/sungai/updateProperty').post(river.updateRiverPropertyCall);
    app.route('/api/geojson/sungai/attributById/:featureId').get(river.loadAttributesById);

    // query properti sungai (18/07/2019)
    app.route('/api/geojson/sungai/queryProperti/:featureId').get(river.queryProperti);

    // replace map sungai (18/07/2019)
    app.route('/api/geojson/sungai/replaceMap').post(river.replaceMapRiver);

    const project = require('../controllers/project');
    app.route('/api/geojson/project/load').get(project.load); // added to postman
    app.route('/api/geojson/project/add').post(project.addProject); // added to postman
    app.route('/api/geojson/project/attribut/:featureId').get(project.loadAttributes); // added to postman

    app.route('/api/geojson/project/getUploadFiles/:featureId').get(project.getUploadFiles); // added to postman
    app.route('/api/geojson/project/hapus').post(project.deleteProject);

    // replace coordinat project (22/07/2019)
    app.route('/api/geojson/project/replaceCoordinate').post(project.replaceCoordinat);

    // save geojson folder static
    app.route('/api/geojson/download/:filename').get(geojson.exportFile);

    // test endpoints
    /*
        TODO #NO 1 
        *** read below section for details
     */
    //app.route('/api/sungai').get(river.load_sungai);
    
    // TODO
    /*
        1.  create 1 api request for river coordinates combine with their attributes as a single response
            expected output is a json/geojson file

        2.  export and combined river & project data for website
            expected format is a json file

        3.  dump database as backup sql file
            expected format as string with .sql extension

     */
    
}