const store = require('../data/store');

exports.getContent = (req, res) => {
  const content = store.content;
  res.json({ success: true, content });
};
