module.exports = () => {
  return (req, res, next) => {
    res.locals.error = "";
    res.locals.errors = {};
    res.locals.values = {};
    res.locals.vaultSuccess = undefined;
    res.locals.resetSuccess = undefined;
    res.locals.deleteSuccess = undefined;
    res.locals.updateSuccess = undefined;
    res.locals.ongoing = undefined;
    res.locals.showCreate = undefined;
    res.locals.showVault = undefined;
    res.locals.showProfile = undefined;
    res.locals.shownData = undefined;
    if (!req.session.user) {
      res.locals.user = undefined;
    } else {
      res.locals.user = req.session.user;
    }

    next();
  };
};
