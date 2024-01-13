const { get$ResourceName } =
    require('../controller/$ResourceName-controller');

const router = require('express').Router();

router.get('/', get$ResourceName);

module.exports = router;