const authPage = (permissions) => {
  return (req, res, next) => {
    const UserRole = req.body.role;
    if (permissions.includes(UserRole)) {
      next();
    } else {
      return res.status(401).json({
        err: "Sorry You Don't Have Permission To Access",
      });
    }
  };
};

module.exports = { authPage };
