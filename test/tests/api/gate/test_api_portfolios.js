
const request = require('supertest');
const app = require('../../../../server');
const route = require('../../../factories/route.factory').route('/gate/portfolios');
const user_factory = require('../../../factories/user.factory');
const jwt_factory = require('../../../factories/jwt.factory');
const portfolio_factory = require('../../../factories/portfolio.factory');
const photo_factory = require('../../../factories/photo.factory');

require('should');

describe('API /gate/portfolios', function () {
  let server;
  var user;
  var token;
  var portfolio;
  this.beforeEach(async () => {
    server = app.listen();
    user = await user_factory.default(true, {}, ['password']);
    token = jwt_factory.default(user.id);
    portfolio = await portfolio_factory.default(true, {author_id: user.id});
    for(var i = 0; i < 4; i++){
      var photo = await photo_factory.default(true, {author_id: user.id})
      await photo.addToPortfolio(portfolio.id);
    }
  });
  afterEach(function() {
    server.close();
  });
  it('get', function(done) {
    request(server)
      .get(`${route}/${portfolio.id}`)
      .set({'Token': token})
      .expect(200, done);
  });
  it('get - wrong id', function(done) {
    request(server)
      .get(`${route}/${portfolio.id + 1}`)
      .set({'Token': token})
      .expect(404, done);
  });
  it('index', function(done) {
    request(server)
      .get(`${route}`)
      .set({'Token': token})
      .expect(200, done);
  });
  it('index - paginate', function(done) {
    request(server)
      .get(`${route}`)
      .query({page: 1})
      .set({'Token': token})
      .expect(200, done);
  });
  it('delete /{id}', function(done) {
    request(server)
      .del(`${route}/${portfolio.id}`)
      .set({'Token': token})
      .expect(204, done)
  });
});
