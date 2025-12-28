const { DB } = require('./lib');

module.exports.up = async function up(next) {
  await DB.collection('seo').insertMany([
    {
      path: '/search',
      title: 'Search page',
      description: 'Custom SEO data for /search page'
    },
    {
      path: '/spotlight',
      title: 'Spotlight page',
      description: 'Custom SEO data for /spotlight page'
    },
    {
      path: '/premium-escorts',
      title: 'Premium-escorts page',
      description: 'Custom SEO data for /premium-escorts page'
    }
  ]);

  next();
};

module.exports.down = function down(next) {
  next();
};
