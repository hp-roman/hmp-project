const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    id_dish: String,
    view: Number,
    token: String,
});

module.exports = mongoose.model('History', HistorySchema);