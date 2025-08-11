const db = require('../SequelizeSetup');
const User = db.user;

const createUser = async (userInfo) => {
  try {
    const ifEmailExists = await User.findOne({ where: { email: userInfo.email } });

    if (ifEmailExists) {
      throw new Error('Email has already been registered');
    }

    const newUser = await User.create(userInfo);
    return newUser;

  } catch (error) {
    throw error;
  }
};

module.exports = createUser;