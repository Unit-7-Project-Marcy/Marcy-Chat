const updateProfilePicture = async (req, res)  => {
    const { session, db: { User }  } = req;
    const userId = session.userId;
    const filePath = req.file.path;

    console.log(filePath)
    // Save the file path to the user's profile in the database
    await User.updateProfilePicture(userId, filePath);
    
    res.send({filepath:filePath});
}

  module.exports = updateProfilePicture