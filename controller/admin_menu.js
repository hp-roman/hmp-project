const Menu = require("../models/menu");

// @desc    API get all menu
// @route   /api/admin/menu

exports.getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.find();
    res.json({ success: true, data: menus });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};
