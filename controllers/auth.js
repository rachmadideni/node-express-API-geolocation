import jwt from 'jsonwebtoken';
import db from '../dbSequelize';
import response from './res';

exports.signin = (req, res) => {
  const {
    username,
    password,
  } = req.body;

  const {
    user,
  } = db.models;

  user.findOne({ where: { usernm: username, passwd: password } }).then((results) => {
	    // console.log(results);

	    if (results) {
	    	try {
				    const { iduser, usernm, user_category } = results.dataValues;

				    // create token
				    const token = jwt.sign({
          iduser,
          username: usernm,
          user_category,
        }, process.env.token_secret, {
          expiresIn: '1200000', // 20 menit
        });

        const data = {
          iduser,
          username: usernm,
          user_category,
          token,
        };

        response.ok(data, res);
			    } catch (err) {
        response.error('error creating user token', res);
			    }
	    } else {
	    	response.error(results, res);
	    }
  });
};
