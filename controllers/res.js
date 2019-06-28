exports.ok = (values, res) => {
	const data = {
		'status':200,
		'data': values
	};
	res.json(data);
	res.end();
}

exports.error = (values,res) => {
	const data = {
		'status':401,
		'data': values
	};
	res.json(data);
	res.end();		
}