const FetchUser = async (userId) => {

let userDets;

if (userId) {

// Fetch a single user by ID if userId is provided

userDets = await User.findOne({ where: { id: userId } });

// Check if the user exists

if (!userDets) {

throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

}

} else {

// Fetch all users if no userId is provided

userDets = await User.findAll();

// Check if any users were found

if (userDets.length === 0) {

throw new ApiError(httpStatus.NOT_FOUND, 'No users found');

        }
    }
}

module.exports = FetchUser;