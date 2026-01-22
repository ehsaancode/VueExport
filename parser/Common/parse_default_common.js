const defaultText = require("./parse_default_text");
const defaultTextH6 = require("./parse_default_texth6");
const defaultTextH2 = require("./parse_default_texth2");
const defaultTextH1 = require("./parse_default_texth1");
const defaultButton = require("./parse_default_button");
const defaultImage = require("./parse_default_image");
const defaultFloatingButton = require("./parse_default_floating_button");
const defaultSlider = require("./parse_default_slider");
const defaultCheckBox = require("./parse_default_check_box");
const defaultSwitch = require("./parse_default_switch");
const defaultRadio = require("./parse_default_radio");
const defaultParallax = require("./parse_default_parallax");
const defaultMarquee = require("./parse_default_marquee");
const defaultDropdown = require("./parse_default_drop_down");
const parseDefaultFullWidth = require("./parse_default_full_width");
const parseDefaultDiv = require("./parse_default_div");
const parseDefaultAccordion = require("./parse_default_accordion");
const parseDefaultParallax = require("./parse_default_parallax");
const parseDefaultMarquee = require("./parse_default_marquee");
const parseDefaultRow = require("./parse_default_row");
const parseDefaultWrap = require("./parse_default_wrap");
const defaultSpan = require("./parse_default_span");
const defaultStack = require("./parse_default_stack");
const parseDefaultMainCanvas = require("./parse_default_main_canvas");
const parseDefaultHeaderBar = require("./parse_default_header_bar");
const parseDefaultBottomMenu = require("./parse_default_bottom_menu");
const parseDefaultFloatingButton = require("./parse_default_floating_button");
const parseDefaultAccrodion = require("./parse_default_accordion");
const parseDefaultIcon = require("./parse_default_icon");
const parseDefaultTable = require("./parse_default_table");

async function defaultObjct(jsonObject) {
  try {
    if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QCounterButton"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QMainCanvas"
    ) {
      return (await parseDefaultMainCanvas.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QDiv"
    ) {
      return (await parseDefaultDiv.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QFullWidth"
    ) {
      return (await parseDefaultFullWidth.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QSpan"
    ) {
      return (await defaultSpan.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QRow"
    ) {
      return (await parseDefaultRow.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QHeaderBar"
    ) {
      return (await parseDefaultHeaderBar.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QBottomMenu"
    ) {
      return (await parseDefaultBottomMenu.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QStack"
    ) {
      return (await defaultStack.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QAccordion"
    ) {
      return (await parseDefaultAccrodion.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QTable"
    ) {
      return (await parseDefaultTable.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QWrap"
    ) {
      return (await parseDefaultWrap.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QCheckBox"
    ) {
      return (await defaultCheckBox.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QSwitch"
    ) {
      return (await defaultSwitch.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QRadio"
    ) {
      return (await defaultRadio.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QDropdown"
    ) {
      return (await defaultDropdown.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QProgressBar"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Type"] == "block_button"
    ) {
      return (await defaultButton.getDefaultObject(jsonObject["design"])) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QModal"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QShimmer"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QParallax"
    ) {
      return (await defaultParallax.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QMarquee"
    ) {
      return (await defaultMarquee.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QIcon"
    ) {
      return (await parseDefaultIcon.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QSlider"
    ) {
      return (await defaultSlider.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QImageNetwork"
    ) {
      return (await defaultImage.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QHeaderBar"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QBottomMenu"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QFloatingButton"
    ) {
      return (await defaultFloatingButton.getDefaultObject()) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QStickyHeader"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QTabBar"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QHMenuItem"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QMenuBar"
    ) {
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QText"
    ) {
      return (await defaultText.getDefaultObject(jsonObject["type"])) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH6"
    ) {
      return (await defaultTextH6.getDefaultObject(jsonObject["type"])) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH2"
    ) {
      return (await defaultTextH2.getDefaultObject(jsonObject["type"])) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH1"
    ) {
      return (await defaultTextH1.getDefaultObject(jsonObject["type"])) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QParagraph"
    ) {
      return (await defaultText.getDefaultObject(jsonObject["type"])) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH4"
    ) {
      return (await defaultText.getDefaultObject(jsonObject["type"])) ?? "";
    } else if (
      "webdesign_Default_Attrs" in jsonObject &&
      jsonObject["webdesign_Default_Attrs"] &&
      jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH5"
    ) {
      return (await defaultText.getDefaultObject(jsonObject["type"])) ?? "";
    }
  } catch (error) {
    console.error("An error occurred while reading the file:", error);
    return null;
  }

  return "";
}

module.exports = {
  defaultObjct,
};
