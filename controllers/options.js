import db from '../dbSequelize';
import response from './res';

exports.kecamatan = (req,res) => {

	const optionKey = req.params.optionKey;
	
	const q = `select idkecm,nmkecm from mst_kecamatan order by nmkecm asc`;
	db.query(q,{
		type:db.QueryTypes.SELECT
	}).then(result=>{		
		if(result){
			response.ok(result,res);
		}else{
			response.error(result,res);
		}
	})
}