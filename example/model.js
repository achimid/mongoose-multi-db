const mongoose = require('../mongoose-multi-db')

const schema = mongoose.Schema({    
    name: { type: String }, 
    age: { type: Number }, 
    phone: { type: String }, 
    email: { type: String }
}, { versionKey: false, timestamps: false })

module.exports = mongoose.model('person', schema, require('./config'))