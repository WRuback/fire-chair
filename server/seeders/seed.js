const db = require('../config/connection');
const { Prompt } = require('../models');
const promptSeeds = require('./promptSeeds.json');

db.once('open', async () => {
  try {
    await Prompt.deleteMany({});
    await Prompt.create(promptSeeds);

    console.log('all done!');
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
