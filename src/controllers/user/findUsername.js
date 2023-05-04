const findByUsername = async (req, res) => {
    const {
      db: { User },
      query: { username },
    } = req;
  
    const user = await User.searchUsername(username);
    if (!user) return res.sendStatus(404);
  
    res.send(user);
  };
  
  module.exports = findByUsername;
  