const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/nyc_safety', {
  dialect: 'postgres'
});

const User = sequelize.define('user', {
  username: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  email: Sequelize.TEXT,
  bookmarks: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  }
});

const Incident = sequelize.define('incident', {
  // apiId taken from NYC Open Data - NYPD API's collision_id
  apiId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  borough: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false
  },
  time: {
    type: Sequelize.STRING,
    allowNull: true
  },
  latitude: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  longitude: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  cyclistsInjured: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  cyclistsKilled: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  pedestriansInjured: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  pedestriansKilled: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  motoristsInjured: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  motoristsKilled: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalInjured: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalKilled: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
});

const UserIncident = sequelize.define('userIncident');

Incident.belongsToMany(User, { through: UserIncident });
User.belongsToMany(Incident, { through: UserIncident });

module.exports = {
  User,
  Incident,
  UserIncident,
  sequelize: sequelize
};
