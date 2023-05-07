
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
	_id: String,
	data: Object
});


module.exports = mongoose.model('Google_Docs_Document', DocumentSchema);

