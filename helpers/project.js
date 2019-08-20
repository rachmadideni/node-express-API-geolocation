import _ from 'lodash';
import db from '../dbSequelize';

const {
  project,
} = db.models;

const isFeatureIdExists = async (features) => {
  const featureId = _.map(features, 'id');
  const result = await project.findOne({
    where: { featureId },
  });

  if (result) {
    return result.dataValues.featureId;
  }
  return result;
};

const clearProjectByFeatureId = async (featureId) => {
  const result = await project.destroy({
    where: { featureId },
  });
  return result; // return number deleted rows
};

const generateInsertValues = async (features, properties) => {
  const featureId = features.id;
  const coord = features.geometry.coordinates;

  // const featureId = _.map(features, 'id');
  // const geom = _.map(features, 'geometry');
  // const coord = geom[0].coordinates;
  // const coord = geom.coordinates;

  // console.log('generateInsertValues features: ', features);
  // console.log('generateInsertValues properties: ', properties);

  // console.log(properties);
  const { nampro } = properties;
  const { tglpro } = properties;
  const { ketera } = properties;

  const values = [];
  // values.push(featureId[0],nampro,tglpro,ketera,coord[0],coord[1]);
  values.push(featureId, nampro, tglpro, ketera, coord[0], coord[1]);
  return values;
};

const insertProjectData = async (values) => {
  const result = await project.create({
    featureId: values[0],
    nampro: values[1],
    tglpro: values[2],
    ketera: values[3],
    lng: values[4],
    lat: values[5],
  });
  return result;
};

export {
  isFeatureIdExists,
  clearProjectByFeatureId,
  generateInsertValues,
  insertProjectData,
};
