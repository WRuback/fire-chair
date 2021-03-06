const { Schema, model } = require('mongoose');

const promptSchema = new Schema({
    promptText: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    masterDeck: {
        type: Boolean,
        required: true,
    },
});

const Prompt = model('Prompt', promptSchema);

module.exports = Prompt;