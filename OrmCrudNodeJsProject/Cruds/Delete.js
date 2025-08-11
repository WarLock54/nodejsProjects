const db = require('../SequelizeSetup');
const User = db.user;

const deleteUser = async (userId) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error("User doesn't exist");
  }

  await user.destroy();
  return user;
};

module.exports = deleteUser;
