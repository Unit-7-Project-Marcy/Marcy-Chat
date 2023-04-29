const showMyPic = async (req, res) => {
    const { session, db: { User } } = req;
    if (!session.userId) return res.sendStatus(401);
  
    const user = await User.findProfilePicture(session.userId);
    res.send({user});
  };
  

  module.exports = showMyPic;
