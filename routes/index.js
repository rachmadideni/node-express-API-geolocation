import multer from 'multer';

// Options Storage
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/');
  },
  filename(req, file, callback) {
    const ext = file.mimetype.split('/')[1];
    // str.split("/")[1];
    callback(null, `${file.fieldname}_${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

module.exports = (app) => {
  // REQUIRE CONTROLLER
  const auth = require('../controllers/auth');
  const geojson = require('../controllers/geojson');
  const options = require('../controllers/options');
  const river = require('../controllers/river');
  const project = require('../controllers/project');
  const utilities = require('../controllers');

  // AUTH
  app.route('/api/auth/signin').post(auth.signin); // otoriasasi

  // IMPORT RAW GEOJSON, DOWNLOAD
  app.route('/api/geojson/import').post(geojson.import); // import geojson (hanya berlaku utk data sungai) ke database: tabel sungai_geom
  app.route('/api/geojson/download/:filename').get(geojson.exportFile); // Export/save geojson folder static
  app.route('/api/geojson/shape/upload').post(geojson.uploadShape); // import shape file
  app.route('/api/geojson/shape/upload').get(geojson.getShapeInfo); // import shape file
  app.route('/api/geojson/hapusUpload/:filename').get(geojson.deleteUpload);


  // CREATE ZIP FROM UPLOAD DIR
  app.route('/api/utilities/makezip/upload').get(utilities.makezip);

  // OPTIONS
  app.route('/api/options/:optionKey').get(options.kecamatan); // kecamatan
  app.route('/api/options/marker/list').get(options.getMarkerOptions); // marker

  // SUNGAI
  app.route('/api/geojson/load/river').get(river.load); // Load Sungai
  app.route('/api/geojson/sungai/attribut/:idsung').get(river.loadAttributes); // Query Atribut berdasarkan Id Sungai
  app.route('/api/geojson/sungai/add').post(river.addRiver); // added to postman
  app.route('/api/geojson/sungai/hapus').post(river.deleteRiver); // added to postman
  app.route('/api/geojson/sungai/addNew').post(river.addNewRiver); // tambah sungai baru
  app.route('/api/geojson/sungai/updateProperty').post(river.updateRiverPropertyCall);
  app.route('/api/geojson/sungai/attributById/:featureId').get(river.loadAttributesById); // Query Atribut sungai berdasarkan Feature Id
  app.route('/api/geojson/sungai/queryProperti/:featureId').get(river.queryProperti); // query properti sungai (18/07/2019)
  app.route('/api/geojson/sungai/replaceMap').post(river.replaceMapRiver); // replace map sungai (18/07/2019)

  // PROJECT
  app.route('/api/geojson/project/load').get(project.load); // Load Project
  app.route('/api/geojson/project/add').post(project.addProject); // Tambah Project Baru
  app.route('/api/geojson/project/addNew').post(project.addNewProject); // Tambah Project Baru menggunakan kolom geometry di tabel
  app.route('/api/geojson/project/getAttribute/:featureId').get(project.getProjectAttributes); // tes get attribute dari test_project
  app.route('/api/geojson/project/getAllProjectAttributes').get(project.getAllProjectAttributes); // tes get All attribute dari test_project
  app.route('/api/geojson/project/addProperties').post(project.addProjectProperties); // test add properties ke test_project

  app.route('/api/geojson/project/attribut/:featureId').get(project.loadAttributes); // Query Atribut Project
  app.route('/api/geojson/project/getUploadFiles/:featureId').get(project.getUploadFiles); // Ambil File upload Project
  app.route('/api/geojson/project/hapus').post(project.deleteProject); // Hapus Project
  app.route('/api/geojson/project/replaceCoordinate').post(project.replaceCoordinat);// replace coordinat project (22/07/2019)
};
