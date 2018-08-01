const passport = require('passport');
const { Strategy, Issuer } = require('openid-client');
const models = require('./models');
const Sequelize = require('sequelize');
const { User } = models;
const { Op } = Sequelize;

const params = {
  passReqToCallback: true,
  scope: 'openid profile email address phone offline_access',
  redirect_uri: 'https://orbis.zone/api/auth/cb',
  authorizationURL: 'https://login.willb.info/identity/connect/authorize',
  tokenURL: 'https://login.willb.info/identity/connect/token',
  userInfoURL: 'https://login.willb.info/identity/connect/userinfo',
  response_type: 'code'
};
// ... any authorization request parameters go here
// client_id defaults to client.client_id
// redirect_uri defaults to client.redirect_uris[0]
// response type defaults to client.response_types[0], then 'code'
// scope defaults to 'openid'
const passReqToCallback = false; // optional, defaults to false, when true req is passed as a first
                                 // argument to verify fn

const usePKCE = false;
let client;
Issuer.discover('https://login.willb.info') // => Promise
  .then(issuer => {
    console.log('Discovered issuer');
    client = new issuer.Client({
      client_secret: process.env.CLIENT_SECRET || 'e14b6974302683c4051d',
      client_id: 'a555021d-17d2-4b4e-8f16-f831d8add0f5'
    });
    passport.use('oidc', new Strategy({ client, params, passReqToCallback, usePKCE }, (tokenset, userinfo, done) => {
      console.log('tokenset', tokenset);
      console.log('access_token', tokenset.access_token);
      console.log('id_token', tokenset.id_token);
      console.log('claims', tokenset.claims);
      console.log('userinfo', userinfo);
      return done(null, userinfo);
    }));

  });

module.exports = passport;
