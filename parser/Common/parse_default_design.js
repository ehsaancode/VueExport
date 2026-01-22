const defaultText = require('./parse_default_text');
const defaultTextH1 = require('./parse_default_texth1');
const defaultTextH2 = require('./parse_default_texth2');
const defaultTextH3 = require('./parse_default_texth3');
const defaultTextH4 = require('./parse_default_texth4');
const defaultTextH5 = require('./parse_default_texth5');
const defaultTextH6 = require('./parse_default_texth6');
const defaultButton = require('./parse_default_button');
const defaultImage = require('./parse_default_image');
const defaultFloatingButton = require('./parse_default_floating_button');
const defaultSlider = require('./parse_default_slider');
const defaultCheckBox = require('./parse_default_check_box');
const defaultSwitch = require('./parse_default_switch');
const defaultRadio = require('./parse_default_radio');
const defaultParallax = require('./parse_default_parallax');
const defaultMarquee = require('./parse_default_marquee');
const defaultDropdown = require('./parse_default_drop_down');
const parseDefaultFullWidth = require('./parse_default_full_width');
const parseDefaultDiv = require('./parse_default_div');
const parseDefaultFlex = require('./parse_default_flex');
const parseDefaultAccordion = require('./parse_default_accordion');
const parseDefaultParallax = require('./parse_default_parallax');
const parseDefaultMarquee = require('./parse_default_marquee');
const parseDefaultRow = require('./parse_default_row');
const parseDefaultWrap = require('./parse_default_wrap');
const defaultSpan = require('./parse_default_span');
const defaultStack = require('./parse_default_stack');
const parseDefaultMainCanvas = require('./parse_default_main_canvas');
const parseDefaultHeaderBar = require('./parse_default_header_bar');
const parseDefaultBottomMenu = require('./parse_default_bottom_menu');
const parseDefaultFloatingButton = require('./parse_default_floating_button');
const parseDefaultAccrodion = require('./parse_default_accordion');
const defaultInputSearch = require('./parse_default_input_search');
const defaultTableSearch = require('./parse_default_table_search');
const defaultTableWrapper = require('./parse_default_table_wrapper');
const defaultTable = require('./parse_default_table');
const defaultIcon = require('./parse_default_icon');
const parseDefaultTablePaginationInfo = require('./parse_default_table_pagination_Info');
const parseDefaultPageIndicator = require('./parse_default_pageIndicator');
const parseDefaultTablePagination = require('./parse_default_table_pagination');
const parseDefaultTableFilter = require('./parse_default_table_filter');
const parseDefaultTableSort = require('./parse_default_table_sort');
const parseDefaultMap = require('./parse_default_map');
const parseDefaultVideo = require('./parse_default_video');




async function defaultDesign(jsonObject) {

    try {
        if("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QCounterButton") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QMainCanvas") {
            await parseDefaultMainCanvas.parseDefaultMainCanvas(jsonObject["webdesign_Default_Attrs"]);
        }


         else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTableSort") {
            await parseDefaultTableSort.parseDefaultTableSort(jsonObject["webdesign_Default_Attrs"]);
        }

          else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTableFilter") {
            await parseDefaultTableFilter.parseDefaultTableFilter(jsonObject["webdesign_Default_Attrs"]);
        }


        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTablePaginationInfo") {
         await parseDefaultTablePaginationInfo.parseDefaultTablePaginationInfo(jsonObject["webdesign_Default_Attrs"]);
        }

         else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QPageIndicator") {
         await parseDefaultPageIndicator.parseDefaultPageIndicator(jsonObject["webdesign_Default_Attrs"]);
        }

         else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTablePagination") {
         await parseDefaultTablePagination.parseDefaultTablePagination(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QDiv") {
            await parseDefaultDiv.parseDefaultDiv(jsonObject["webdesign_Default_Attrs"]);
        }
         else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QFlex") {
            await parseDefaultFlex.parseDefaultFlex(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QFullWidth") {
            await parseDefaultFullWidth.parseDefaultFullWidth(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QSpan") {
            await defaultSpan.parseDefaultSpan(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QRow") {
            await parseDefaultRow.parseDefaultRow(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QHeaderBar") {
             await parseDefaultHeaderBar.parseDefaultHeaderBar(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QBottomMenu") {
             await parseDefaultBottomMenu.parseDefaultBottomMenu(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QStack") {
            await defaultStack.parseDefaultStack(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QAccordion") {
            await parseDefaultAccrodion.parseDefaultAccordion(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTable") {
                   await defaultTable.parseDefaultTable(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QWrap") {
            await parseDefaultWrap.parseDefaultWrap(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QCheckBox") {
            await defaultCheckBox.parseDefaultCheckBox(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QSwitch") {
            await defaultSwitch.parseDefaultSwitch(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QRadio") {
            await defaultRadio.parseDefaultRadio(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QDropdown") {
            await defaultDropdown.parseDefaultDropdown(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QProgressBar") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Type"] == "block_button") {
            await defaultButton.parseDefaultButton(jsonObject);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QModal") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QShimmer") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QParallax") {
            await defaultParallax.parseDefaultParallax(jsonObject["webdesign_Default_Attrs"]);

        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QMarquee") {
            await defaultMarquee.parseDefaultMarquee(jsonObject["webdesign_Default_Attrs"]);

        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QIcon") {
            await defaultIcon.parseDefaultIcon(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QSlider") {
           defaultSlider.parseDefaultSlider(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QImageNetwork") {
            await defaultImage.parseDefaultImage(jsonObject["webdesign_Default_Attrs"]);

        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QHeaderBar") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QBottomMenu") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QFloatingButton") {

            await defaultFloatingButton.parseDefaultFloatingButton(jsonObject["webdesign_Default_Attrs"]);

        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QStickyHeader") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTabBar") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QHMenuItem") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QMenuBar") {
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QText") {
            await defaultText.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        }
        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH1") {
            await defaultTextH1.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        }
        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH2") {
            await defaultTextH2.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        } 
         else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH3") {
            await defaultTextH3.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        } 
         else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH4") {
            await defaultTextH4.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        } 
         else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH5") {
            await defaultTextH5.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        } 
          else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH6") {
            await defaultTextH6.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        } 

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QParagraph") {
            await defaultText.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        }
        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH4") {
            await defaultText.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        }

        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTextH5") {
            await defaultText.parseDefaultText(jsonObject["webdesign_Default_Attrs"]);
        }
         else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QInputSearch") {
            await defaultInputSearch.parseDefaultInputSearch(jsonObject["webdesign_Default_Attrs"]);
        }
          else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTableSearch") {
            await defaultTableSearch.parseDefaultTableSearch(jsonObject["webdesign_Default_Attrs"]);
        }
        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QTableWrapper") {
            await defaultTableWrapper.parseDefaultTableWrapper(jsonObject["webdesign_Default_Attrs"]);
        }
          else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QMap") {
            await parseDefaultMap.parseDefaultMap(jsonObject["webdesign_Default_Attrs"]);
        } 
        else if ("webdesign_Default_Attrs" in jsonObject && jsonObject["webdesign_Default_Attrs"] && jsonObject["webdesign_Default_Attrs"]["type"] == "QVideoNetwork") {
            await parseDefaultVideo.parseDefaultVideo(jsonObject["webdesign_Default_Attrs"]);
        }

      

    }catch (error) {
        console.error('An error occurred while reading the file:', error);
        return null;
    }
  } 


module.exports = {
  defaultDesign,
};
