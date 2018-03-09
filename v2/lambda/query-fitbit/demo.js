require('./').handler({
  accessToken: process.env.FITBIT_DEMO_USER_ACCESS_TOKEN,
  baseDate: '2018-01-01',
  period: '1y',
  resourceCategory: 'activities',
  resourceSubcategory: 'steps'
});
