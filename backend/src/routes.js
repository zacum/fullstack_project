const router = require('express').Router();

router.use('/users', require('src/modules/users/user.controller'));

module.exports = router;
