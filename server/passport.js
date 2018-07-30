const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('./models');
const Sequelize = require('sequelize');
const {User} = models;
const { Op } = Sequelize;

passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    User.find({
      where: {
        [Op.or]: [
          {
            email: username
          },
          {
            username
          }
        ]
      },
      attributes: ['id', 'email', 'username', 'password']
    })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user.get({plain: true}));
      })
      .catch(err => {
        console.error(err);
        return done(null, false, { message: 'Failed' });
      });
  })
);

module.exports = passport;
