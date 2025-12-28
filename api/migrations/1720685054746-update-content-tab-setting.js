const { DB, COLLECTION } = require('./lib');

module.exports.up = async function up(next) {
  await DB.collection(COLLECTION.SETTING).deleteMany({
    key: {
      $in: [
        'welcomePageId',
        'homeContentPageId'
      ]
    }
  });

  // update contact page content
  const contactPage = await DB.collection(COLLECTION.SETTING).findOne({
    key: 'contactPageId'
  });
  if (contactPage && contactPage.value) {
    const post = await DB.collection('posts').findOne({
      slug: contactPage.value
    });
    if (post) {
      await DB.collection(COLLECTION.SETTING).insertOne({
        key: 'contactContent',
        title: 'Contact content',
        description: 'Content will be shown on the contact page, it can include your contact information',
        visible: true,
        public: true,
        value: post.content,
        group: 'pageContent',
        type: 'text-editor',
        editable: true,
        autoload: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await DB.collection('posts').deleteOne({
        slug: contactPage.slug
      });
    }
  }

  await DB.collection(COLLECTION.SETTING).deleteOne({
    key: 'contactPageId'
  });

  next();
};

module.exports.down = function down(next) {
  next();
};
