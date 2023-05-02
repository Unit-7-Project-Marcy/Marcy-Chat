const showUser = async (req, res) => {
  const {
    db: { User },
    query: { id },
  } = req;

  const user = await User.find(Number(id));
  if (!user) return res.sendStatus(404);

  res.send(user);
};

module.exports = showUser;
