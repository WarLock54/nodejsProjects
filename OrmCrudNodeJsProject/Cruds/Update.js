const db = require('../SequelizeSetup');
const User = db.user;

const updateUser = async (userId, userDetails) => {
  const user = await User.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error("User doesn't exist");
  }

  await user.update(userDetails);
  
  return user;
};

module.exports = updateUser;
