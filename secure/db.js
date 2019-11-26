function findData(modal,object){

	return new Promise(function(resolve,reject){

		modal.findOne(object,(err,data) => {
			if(err)  reject(err);
			if(data) resolve(data);
			return resolve();
		});

	});
	
}


// let gfs

// conn.once('open', () => {
//   gfs = Grid(conn.db, mongoose.mongo)
//   gfs.collection('uploads')
//   console.log('Connection Successful')
// })


module.exports.findData = findData;