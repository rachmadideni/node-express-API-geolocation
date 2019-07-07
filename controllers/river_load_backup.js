exports.load = (req,res) => {
	
	const {
		sungai_geom:riverMdl
	} = db.models

	const getUniqueFeatures = async () => {
		try{			
			const result = await riverMdl.findAll();
			const uniqueResult = _.uniq(result.map(item=>item.featureId));			
			return uniqueResult;			
		}catch(err){
			console.log('error while get features data',err);
		}
	}

	// get array of coordinates from each features
	const getCoordinatesFromFeatures = async (featureId,index) => {
		try{
			const coordinates = await riverMdl.findAll({ where:{ featureId:featureId }})
			const coordItem = coordinates.map(coord=>{
				let item = []
				item.push(coord.lng);
				item.push(coord.lat);
				return item;
			});
			return coordItem;
			
		}catch(err){
			console.log('error while getting coordinates data',err);	
		}
	}

	// test ambil atribut
	const getAttribut = async (featureId) => {
		const q = `SELECT 
							a.idkecm,c.nmkecm,b.nmsung,a.jenis_sungai,a.keterangan
							FROM sungai_geom a
							INNER JOIN mst_sungai b on a.idsung=b.id 
							INNER JOIN mst_kecamatan c on a.idkecm=c.idkecm
							WHERE a.featureId='1'
							limit 1`;
		const attribut = await db.query(q, { replacements: { featureId: featureId }, type:db.QueryTypes.SELECT })		
		return attribut;		
	}

	getUniqueFeatures().then(result=>{
			if(result.length > 0){
				const uniqueLength = result.length
				const features = [];

				result.map((featureId,index)=>{
					getCoordinatesFromFeatures(featureId,index).then(result => {

						const myAtt = getAttribut(featureId).then(result=>{ return result; })

						let obj = {}
						let geom = {}
						let properties = {}
						obj['type'] = 'Feature'
						obj['id'] = featureId;
						geom['type'] = 'LineString'
						geom['coordinates'] = result
						obj['geometry'] = geom;
						obj['properties'] = { featureId, myAtt }
						return obj;
					
					}).then(result2=>{				
						features.push(result2)
						return features;
					}).then(result3=>{
							
						// cek jika data terakhir atau semua features sdh masuk
						if(uniqueLength === index + 1){
							response.ok(features,res);
						}
					});
								
				});

			}else{
				response.error(null,res);
			}
	});
}