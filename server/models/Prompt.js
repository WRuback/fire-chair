const { Schema, model } = require('mongoose');

const promptSchema = new Schema({
    promptText: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    masterDeck: {
        type: Boolean,
        required: true,
    },
});

const Prompt = model('Prompt', promptSchema);

module.exports = Prompt;