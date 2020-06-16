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

// @desc    API add menu
// @route   /api/admin/menu [POST]

exports.addMenu = async (req, res, next) => {
  try {
    const {json} = req.query;
    const menu = JSON.parse(json);
    menu.isSpecial = Boolean(menu.isSpecial);
    await Menu.create(menu);
    const menus = await Menu.find();
    res.json({success: true, data: menus});
  } catch (error) {
    res.json({success: false, error: error});
  }
}

// @desc    API update menu
// @route   /api/admin/menu [PUT]

exports.updateMenu = async (req, res, next) => {
  try {
    const {json, json2} = req.query;
    const newMenu = JSON.parse(json);
    const oldMenu = JSON.parse(json2);
    newMenu.isSpecial = Boolean(newMenu.isSpecial);
    await Menu.updateOne({_id: oldMenu._id}, newMenu);
    const menus = await Menu.find();
    res.json({success: true, data: menus});
  } catch (error) {
    res.json({success: false, error: error});
  }
}