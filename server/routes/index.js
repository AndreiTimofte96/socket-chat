const { Router } = require('express');
const router = Router();

router.get('/', (req, res, next) => {
  res.json({ title: 'Express' });
});

module.exports = router;
