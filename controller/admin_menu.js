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

// @desc    API delete menu
// @route   /api/admin/menu

exports.deleteMenu = async (req, res, next) => {
  try {
    const {json} = req.query;
    const menu = JSON.parse(json);
    await Menu.deleteOne({_id: menu._id});
    const menus = await Menu.find();
    res.json({success: true, data: menus});
  } catch (error) {
    res.json({success: false, error: error});
  }
}