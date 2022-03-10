const db = require('../config/connection');
const { Prompt } = require('../models');
const promptSeeds = require('./promptSeeds');

db.once('open', async () => {
  try {
    await Prompt.deleteMany({});
    for (const prompt of promptSeeds) {
      await Prompt.create(prompt);
    }

    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
