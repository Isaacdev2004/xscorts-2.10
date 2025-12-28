const { DB } = require('./lib');

module.exports.up = async function (next) {
  const conversations = await DB.collection('conversations').find({}).toArray();

  await conversations.reduce(async (cb, conversation) => {
    await cb;

    if (conversation.hashKey || !conversation.recipients || !conversation.recipients.length) return Promise.resolve();

    const hashKey = conversation.recipients.map((c) => c.sourceId.toString()).sort().join('_');
    await DB.collection('conversations').updateOne({ _id: conversation._id }, {
      $set: {
        hashKey
      }
    });

    return Promise.resolve();
  }, Promise.resolve());

  next();
};

module.exports.down = function (next) {
  next();
};
