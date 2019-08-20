import db from '../dbSequelize';
import response from './res';

// exports.kecamatan = (req,res) => {
exports.kecamatan = (req, res) => {
  const { optionKey } = req.params;

  const q = 'select idkecm,nmkecm from mst_kecamatan order by nmkecm asc';
  db.query(q, {
    type: db.QueryTypes.SELECT,
  }).then((result) => {
    if (result) {
      response.ok(result, res);
    } else {
      response.error(result, res);
    }
  });
};

exports.getMarkerOptions = (req, res) => {
  const { tipe_marker } = db.models;
  tipe_marker.findAll().then((markers) => {
    const markersData = [];
    markers.forEach((marker) => {
      markersData.push(marker);
    });

    if (markersData.length > 0) {
      response.ok(markersData, res);
    } else {
      response.error([], res);
    }
  });
};
