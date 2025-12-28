/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { readFileSync } = require('fs');
const { join } = require('path');
const { DB, COLLECTION } = require('./lib');

const TEMPLATE_DIR = join(__dirname, '..', 'templates', 'emails');

module.exports.up = async function up(next) {
  // layout file
  const template = await DB.collection(COLLECTION.EMAIL_TEMPLATE).findOne({
    key: 'cancel-booking-request-to-delete-account'
  });
  if (!template) {
    const content = readFileSync(join(TEMPLATE_DIR, 'cancel-booking-request-to-delete-account.html')).toString();
    await DB.collection(COLLECTION.EMAIL_TEMPLATE).insertOne({
      key: 'cancel-booking-request-to-delete-account',
      content,
      name: 'Cancel booking after deleted account',
      description: 'Notification email to user once admin approved delete request.',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
