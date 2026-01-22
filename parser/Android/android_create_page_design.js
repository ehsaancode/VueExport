const parserFullWidth = require('./android_parser_full_width');
const parserRow = require('./android_parser_row');
const parserDiv = require('./android_parser_div');
const parserFlex = require('./android_parser_flex');
const parserSection = require('./android_parser_section');
const parserStack = require('./android_parser_stack');
const blockImage = require('./android_parser_block_image');
const blockIcon = require('./android_parser_block_icon');
const blockButton = require('./android_craete_block_button');
const parserMarquee = require('./android_parser_marquee');
const parserWrap = require('./android_parser_wrap');
const parserFloatingButton = require('./android_parser_floating_button');
const parserDrawer = require('./android_parser_drawer');
const parserBlockText = require('./android_parser_block_text');
const parserInputText = require('./android_parser_input_text');
const parserSearch = require('./android_parser_input_search');
const parserRadio = require('./android_parser_radio');
const parserCheckBox = require('./android_parser_check_box');
const parserIncrementCounter = require('./android_parser_increment_counter');
const parserParallax = require('./android_parser_parallax');
const parserSlider = require('./android_parser_slider');
const parseAccordion = require('./android_parser_accordion');
const parseAccordionItem = require('./android_parser_accordion_item');
const parserHeaderBar = require('./android_parser_header_bar');
const parserBottomMenu = require('./android_parser_bottom_menu');
const parserTableWraper = require('./android_parser_table_wraper');
const parserTable = require('./android_parser_table');
const parserTablePagination = require('./android_parser_table_pagination');
const parserTablePaginationButton = require('./android_parser_table_pagination_button');
const parserMap = require('./android_parser_map');

async function pageDesign(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType) {
     //console.log('----------in design : ' + jsonObject['type'] + 'parentWidth : '+ parentWidth + 'parentHeight : '+ parentHeight + '----------\n');
     let objVisibility = jsonObject?.widgetDefaultData?.style?.layout?.visibility ?? "true";
     if (objVisibility != "false") {
          try {
               let objectType = jsonObject['type'];
               // console.log(objectType + '\n');
               if (objectType == "QSlider") {
                    //await blockSlider.parserSlider(startingColum, fileName, jsonObject);
                    let prsSlider = new parserSlider.AndroidParserSlider(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsSlider.parseSlider();
               } else if (objectType == "QButton") {
                    //console.log('+++++++++ parseButton +++++++++++\n');
                    await blockButton.parseBlockButton(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               } else if (objectType == "QImageNetwork") {
                    await blockImage.parseBlockImage(startingColum, fileName, jsonObject, parentType);
               } else if (objectType == "QIcon") {
                    await blockIcon.parseBlockIcon(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               } else if (
                    objectType == "QText" ||
                    objectType == "QParagraph" ||
                    objectType == "QTextH1" ||
                    objectType == "QTextH2" ||
                    objectType == "QTextH3" ||
                    objectType == "QTextH4" ||
                    objectType == "QTextH5" ||
                    objectType == "QTextH6" ||
                    objectType == "QPageIndicator"
               ) {
                    // console.log(`json object in design - ${JSON.stringify(jsonObject)}`);
                    await parserBlockText.parseBlockText(startingColum, fileName, jsonObject, parentType);
               } else if (
                    objectType == "QInputText" ||
                    objectType == "QInputTextNumber" ||
                    objectType == "QInputTextEmail" ||
                    objectType == "QTextarea"
               ) {
                    await parserInputText.parseInputText(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               } else if (objectType == "QRadio") {
                    await parserRadio.parseRadio(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               } else if (objectType == "QCheckBox") {
                    await parserCheckBox.parseCheckBox(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               }
               //else if (objectType == "QFullWidth") {
               //     console.log('+++++++++ parseFullWidth +++++++++++\n parentType: '+parentType);
               //     let prsFullWidth = new parserFullWidth.AndroidParserFullWidth(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               //     await prsFullWidth.parseFullWidth();
               //     await parserFullWidth.parseFullWidth(startingColum, fileName, jsonObject);
               //}
               else if (
                    objectType == "QDiv" ||
                    objectType == "QNSection" ||
                    objectType == "QForm" ||
                    objectType == "QFormInputElement"
               ) {
                    //console.log('+++++++++ parseDiv +++++++++++\n');
                    let prsDiv = new parserDiv.AndroidParserDiv(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsDiv.parseDiv();
               } else if (
                    objectType == "QFlex" ||
                    objectType == "QFullWidth" ||
                    objectType == "QRow"
               ) {
                    //console.log('+++++++++ parseDiv +++++++++++\n');
                    let prsFlex = new parserFlex.AndroidParserFlex(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsFlex.parseFlex();
               } else if (
                    objectType == "Section"
               ) {
                    //console.log('+++++++++ parseSection +++++++++++\n');
                    let prsSection = new parserSection.AndroidParserSection(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsSection.parseSection();
               } else if (
                    objectType == "QRow" ||
                    objectType == "QTablePaginationButton" ||
                    objectType == "QTablePaginationRPP"
               ) {
                    //console.log('+++++++++' + objectType + '\n');
                    let prsRow = new parserRow.AndroidParserRow(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsRow.parseRow();
                    //await parserRow.parseBlockRow(startingColum, fileName, jsonObject);
               } else if (objectType == "QMarquee") {
                    // console.log('+++++++++' + objectType + '\n');
                    let prsMarquee = new parserMarquee.AndroidParserMarquee(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsMarquee.parseMarquee();
               } else if (objectType == "QStack") {
                    // console.log('+++++++++parserStack: ' + objectType + '\n');
                    let prsStack = new parserStack.AndroidParserStack(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsStack.parseStack();
               } else if (objectType == "QIncrementCounter") {
                    // console.log('+++++++++parserIncrementCounter: ' + objectType + '\n');
                    await parserIncrementCounter.parseIncrementCounter(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);

               } else if (objectType == "QParallax") {
                    // console.log('+++++++++parserParallax: ' + objectType + '\n');
                    let prsParallax = new parserParallax.AndroidParserParallax(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsParallax.parseParallax();
                    // await parserParallax.parserParallax(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               } else if (objectType == "QAccordion") {
                    let prsAccordion = new parseAccordion.AndroidParserAccordion(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsAccordion.parseAccordion();
               } else if (objectType == "QAccordionItem") {
                    let prsAccordionItem = new parseAccordionItem.AndroidParserAccordionItem(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsAccordionItem.parseAccordionItem();
               } else if (objectType == "QWrap") {
                    //console.log('+++++++++parser wrap: ' + objectType + '\n');
                    let prsWrap = new parserWrap.AndroidParserWrap(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsWrap.parseWrap();
               } else if (objectType == "QFloatingButton") {
                    // console.log('+++++++++parser floating button: ' + objectType + '\n');

                    let prsFloatingButton = new parserFloatingButton.AndroidParserFloatingButton(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsFloatingButton.parseFloatingButton();
               } else if (objectType == "QDrawer") {
                    //console.log('+++++++++parser drawer menu: ' + objectType + '\n');

                    let prsDrawer = new parserDrawer.AndroidParserDrawer(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsDrawer.parseDrawer();
               } else if (objectType == "QHeaderBar") {
                    // console.log('+++++++++ parseHeaderBar +++++++++++\n');
                    let prsHeaderBar = new parserHeaderBar.AndroidParserHeaderBar(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsHeaderBar.parseHeaderBar();
               } else if (objectType == "QBottomMenu") {
                    // console.log('+++++++++ parseBottomMenu +++++++++++\n');
                    let prsBottomMenu = new parserBottomMenu.AndroidParserBottomMenu(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsBottomMenu.parseBottomMenu();
               } else if (objectType == "QTableWrapper") {
                    //console.log('+++++++++ parseTableWraper +++++++++++\n');
                    let prsTableWrapper = new parserTableWraper.AndroidParserTableWraper(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsTableWrapper.parseTableWraper();
               } else if (objectType == "QTable") {
                    //console.log('+++++++++ parseTable +++++++++++\n');
                    let prsTable = new parserTable.AndroidParserTable(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsTable.parseTable();
               } else if (objectType == "QTablePagination") {
                    //console.log('+++++++++ parseTablePagination +++++++++++\n');
                    let prsTablePagination = new parserTablePagination.AndroidParserTablePagination(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsTablePagination.parseTablePagination();
               }
               /*else if (objectType == "QTablePaginationButton") {
                    //console.log('+++++++++ parseTablePaginationButton +++++++++++\n');
                    let prsTablePaginationButton = new parserTablePaginationButton.AndroidParserTablePaginationButton(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
                    await prsTablePaginationButton.parseTablePaginationButton();
               }*/
               else if (objectType == "QInputSearch" || objectType == "QTableSearch") {
                    await parserSearch.parseInputSearch(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               } else if (objectType == "QMap") {
                    await parserMap.parserMap(startingColum, fileName, jsonObject, parentWidth, parentHeight, parentType);
               }
               else {

               }
               return 'success';
          } catch (err) {
               console.error(err);
               return 'failure';
          }
     }
}

exports.pageDesign = pageDesign
// module.exports = {
//      pageDesign
// }