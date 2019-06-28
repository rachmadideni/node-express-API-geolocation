import db from '../dbSequelize';
import response from './res';

exports.index = (req, res) => {
    response.ok('hello from routes', res);
}