const parserSlider = require('./parser_slider');
const blockDiv = require('./parser_block_div');
const blockImage = require('./parser_block_image');
const parserRowCol = require('./parser_row_col');
const parserFullWidth = require('./parser_full_width');
const parserRow = require('./parser_row');
const parserStack = require('./parser_stack');
const parserDiv = require('./parser_div');
const parserAccordion = require('./parser_accordion');
const parserAccordionItem = require('./parser_accordion_item');
const parserParallax = require('./parser_parallax');
const parserMarquee = require('./parser_marquee');
const parserBlockText = require('./parser_block_text');
const parserButton = require('./parser_button');
const parserDrawer = require('./parser_drawer');
const parserHeaderBar = require('./parser_header_bar');
const parserBottomMenu = require('./parser_bottom_menu');
const parserFloatingButton = require('./parser_floating_button');
const parserForm = require('./parser_form');
const parserFormInputElement = require('./parser_form_input_element');
const parserInputText = require('./parser_input_text');
const parserDropdown = require('./parser_dropdown');
const parserRadioOption = require('./parser_radio_option');
const parserTextarea = require('./parser_textarea');
const parserCheckBox = require('./parser_check_box');
const parserTableWrapper = require('./parser_table_wrapper');
const parserTable = require('./parser_table');
const parserSearch = require('./parser_search');
const parserTableFilter = require('./parser_table_filter');
const parserTableSort = require('./parser_table_sort');
const parserTablePagination = require('./parser_table_pagination');
const parserTablePaginationButton = require('./parser_table_pagination_button');
const parserTablePaginationInfo = require('./parser_table_pagination_info');
const parserTablePaginationRPP = require('./parser_table_pagination_rpp');

async function pageDesign(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     // console.log('----------');
     let  objVisibility = jsonObject["visibility"] ?? "";
     if (objVisibility != "false") {
          try {
               let objectType = jsonObject['type'];
               if (objectType == "QSlider") {
                    let prsSlider = new parserSlider.ParserSlider(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsSlider.parserSlider();
               } else if (objectType == "QTableWrapper") {
                    let prsTableWrapper = new parserTableWrapper.ParserTableWrapper(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsTableWrapper.parseTableWrapper();
               } else if (objectType == "QTable") {
                    let prsTable = new parserTable.ParserTable(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsTable.parseTable();
               } else if (objectType == "QTableSearch") {
                    await parserSearch.parseSearch(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QTableSort") {
                    await parserTableSort.parseTableSort(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QTableFilter") {
                    await parserTableFilter.parserTableFilter(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QTablePagination") {
                    let prsTablePagination = new parserTablePagination.ParserTablePagination(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsTablePagination.parseTablePagination();
               } else if (objectType == "QTablePaginationButton") {
                    await parserTablePaginationButton.parseTablePaginationButton(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QTablePaginationInfo") {
                    await parserTablePaginationInfo.parseTablePaginationInfo(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QTablePaginationRPP") {
                    await parserTablePaginationRPP.parseTablePaginationRpp(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QForm") {
                    let prsForm = new parserForm.ParserForm(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsForm.parseForm();
               }  else if (objectType == "QDropdown") {
                    await parserDropdown.parseDropdown(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               }  else if (objectType == "QRadio") {
                    await parserRadioOption.parseRadioOption(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               }  else if (objectType == "QCheckBox") {
                    await parserCheckBox.parseCheckBox(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               }  else if (objectType == "QTextarea") {
                    await parserTextarea.parseTextarea(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               }  else if (objectType == "QFormInputElement") {
                    let prsFormInputElement = new parserFormInputElement.ParserFormInputElement(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsFormInputElement.parseFormInputElement();
               }  else if (objectType == "QInputText" || objectType == "QInputTextEmail" ||
                         objectType == "QInputTextNumber") {
                    await parserInputText.parseInputText(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QButton") {
                    await parserButton.parseBlockButton(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QImageNetwork") {
                    await blockImage.parseBlockImage(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               } else if (objectType == "QParagraph" ||
                         objectType == "QText" ||
                         objectType == "QTextH2" ||
                         objectType == "QTextH1" ||
                         objectType == "QTextH3" ||
                         objectType == "QTextH6") {
                              
                    await parserBlockText.parseBlockText(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    
               } else if (objectType == "QHeaderBar" ) {
                    let prsHeaderBar = new parserHeaderBar.ParserHeaderBar(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsHeaderBar.parseHeaderBar();
               } else if (objectType == "QFloatingButton" ) {
                    let prsFloatingButton = new parserFloatingButton.ParserFloatingButton(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsFloatingButton.parseFloatingButton();
               } else if (objectType == "QBottomMenu" ) {
                    let prsBottomMenu = new parserBottomMenu.ParserBottomMenu(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsBottomMenu.parseBottomMenu();
               } else if (objectType == "QFullWidth" ) {
                    let prsFullWidth = new parserFullWidth.ParserFullWidth(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsFullWidth.parseFullWidth();
               } else if (objectType == "QRow") {
                    let prsRow = new parserRow.ParserRow(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsRow.parseRow();
               } else if (objectType == "QStack") {
                    let prsStack = new parserStack.ParserStack(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsStack.parseStack();
               } else if (objectType == "QDiv" || objectType == "QNSection") {
                    let prsDev = new parserDiv.ParserDiv(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsDev.parseDiv();
               }  else if (objectType == "QAccordion") {
                    let prsAccordion = new parserAccordion.ParserAccordion(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsAccordion.parseAccordion();
               }   else if (objectType == "QAccordionItem") {
                    let prsAccordionItem = new parserAccordionItem.ParserAccordionItem(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsAccordionItem.parseAccordionItem();
               }  else if (objectType == "QParallax") {
                    let prsParallax = new parserParallax.ParserParallax(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsParallax.parseParallax();
               }  else if (objectType == "QMarquee") {
                    let prsMarquee = new parserMarquee.ParserMarquee(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
                    await prsMarquee.parseMarquee();
               } else if (objectType == "row_col_1") {
                    await parserRowCol.parseRowCol(startingColum, fileName, jsonObject, parantMainAlignment, parantCrossAlignment);
               }  else if (objectType == "block_div") {
                    await blockDiv.parseBlockDiv(startingColum, fileName, jsonObject, parantMainAlignment, parantCrossAlignment);
               } else if (objectType == "QDrawer") {
                    await parserDrawer.parseDrawerMenu(startingColum, fileName, jsonObject, parantMainAlignment, parantCrossAlignment);
               } else if (objectType == "row_col_3") {
               
               } else if (objectType == "row_col_4") {
               
               } else if (objectType == "row_col_6") {
               
               } else if (objectType == "row_col_3_9") {
               
               } else if (objectType == "row_col_9_3") {
               
               } else if (objectType == "row_col_4_8") {
               
               } else if (objectType == "row_col_8_4") {
               
               } else if (objectType == "row_col_5_7") {
               
               } else if (objectType == "row_col_7_5") {
               
               } else if (objectType == "row_col_2_10") {
                    
               
               } else if (objectType == "row_col_1_11") {
                    
               
               } else if (objectType == "row_col_2_8_2") {
               
               } else if (objectType == "row_col_3_6_3") {
                    
               } else {
               }
               return 'success';
          } catch (err) {
          console.error(err);
          return 'failure';
          }
     }
}

async function componentFrame(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType) {
     try {
          let frame = {width: 0, height: 0};
          let objectType = jsonObject['type'];
          // console.log(`componentFrame page_design: ${objectType}`);
          if (objectType == "QSlider") {
               
          } else if (objectType == "QButton") {
               
          } else if (objectType == "QImageNetwork") {
               // console.log(`Image parantType...: ${parantType}`);
               frame = await blockImage.componentFrame(jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment);
          } else if (objectType == "QParagraph" ||
                    objectType == "QTextH2" ||
                    objectType == "QTextH1" ||
                    objectType == "QTextH3" ||
                    objectType == "QTextH6") {
                         
               frame = await parserBlockText.componentFrame(jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment);
               
          } else if (objectType == "QFullWidth" ) {
               // console.log('+++++++++ parseFullWidth +++++++++++\n');
               let prsFullWidth = new parserFullWidth.ParserFullWidth(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               frame = await prsFullWidth.componentFrame();
          } else if (objectType == "QRow") {
               let prsRow = new parserRow.ParserRow(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               frame = await prsRow.componentFrame();
          } else if (objectType == "QStack") {
               
          } else if (objectType == "QDiv") {
               // console.log(`QDiv parantType...: ${parantType}`);
               let prsDev = new parserDiv.ParserDiv(startingColum, fileName, jsonObject, parentWidth, parentHeight, parantMainAlignment, parantCrossAlignment, parantType);
               frame = await prsDev.componentFrame();
          }  else if (objectType == "QAccordion") {
               
          }   else if (objectType == "QAccordionItem") {
               
          }  else if (objectType == "QParallax") {
               
          }  else if (objectType == "QMarquee") {
               
          } else if (objectType == "row_col_1") {
               
          }  else if (objectType == "block_div") {
               
          } else if (objectType == "row_col_2") {
          
          } else if (objectType == "row_col_3") {
          
          } else if (objectType == "row_col_4") {
          
          } else if (objectType == "row_col_6") {
          
          } else if (objectType == "row_col_3_9") {
          
          } else if (objectType == "row_col_9_3") {
          
          } else if (objectType == "row_col_4_8") {
          
          } else if (objectType == "row_col_8_4") {
          
          } else if (objectType == "row_col_5_7") {
          
          } else if (objectType == "row_col_7_5") {
          
          } else if (objectType == "row_col_2_10") {
               
          
          } else if (objectType == "row_col_1_11") {
               
          
          } else if (objectType == "row_col_2_8_2") {
          
          } else if (objectType == "row_col_3_6_3") {
               
          } else {
          }

          return frame;
          
     } catch (err) {
       console.error(err);
       return  {width: 0, height: 0};
     }
     
}

exports.pageDesign = pageDesign
exports.componentFrame = componentFrame
// module.exports = {
//      pageDesign
// }