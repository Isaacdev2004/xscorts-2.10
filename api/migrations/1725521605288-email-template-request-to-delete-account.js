/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { readFileSync } = require('fs');
const { join } = require('path');
const { DB, COLLECTION } = require('./lib');

const TEMPLATE_DIR = join(__dirname, '..', 'templates', 'emails');

module.exports.up = async function up(next) {
  // layout file
  const template = await DB.collection(COLLECTION.EMAIL_TEMPLATE).findOne({
    key: 'admin-model-requests-to-delete-account'
  });
  if (!template) {
    const content = readFileSync(join(TEMPLATE_DIR, 'admin-model-requests-to-delete-account.html')).toString();
    await DB.collection(COLLECTION.EMAIL_TEMPLATE).insertOne({
      key: 'admin-model-requests-to-delete-account',
      content,
      name: 'Model requests to delete notification to admin',
      description: 'Notification email to admin once model requests to delete account.',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  const template2 = await DB.collection(COLLECTION.EMAIL_TEMPLATE).findOne({
    key: 'model-account-deleted'
  });
  if (!template2) {
    const content = readFileSync(join(TEMPLATE_DIR, 'model-account-deleted.html')).toString();
    await DB.collection(COLLECTION.EMAIL_TEMPLATE).insertOne({
      key: 'model-account-deleted',
      content,
      name: 'Model account is deleted',
      description: 'Notification email to model once admin accepts to delete.',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
