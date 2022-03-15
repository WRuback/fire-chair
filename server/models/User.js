const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Prompt = require('./Prompt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    playCount: {
        type: Number,
        default: 0
    },
    deck: [{
        type: Schema.Types.ObjectId,
        ref: 'Prompt'
    }]
});

userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;