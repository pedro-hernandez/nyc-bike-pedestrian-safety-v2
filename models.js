const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/nyc_safety', {
  database: 'nyc_safety',
  dialect: 'postgres'
});

const User = sequelize.define('user', {
  username: {
    type: Sequelize.TEXT,
    allowNull: false
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
// apiId taken from NYC Open Data - NYPD API's unique_key
// allows users to bookmark incidents
  apiId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  borough: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
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
    allowNull: false
  },
  cyclistsKilled: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pedestriansInjured: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  pedestriansKilled: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  motoristsInjured: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  motoristsKilled: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  totalInjured: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  totalKilled: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

const UserIncident = sequelize.define('userIncident');

Incident.belongsToMany(User, { through: UserIncident });
User.belongsToMany(Incident, { through: UserIncident });

module.exports = {
  User,
  Incident,
  sequelize: sequelize
};
