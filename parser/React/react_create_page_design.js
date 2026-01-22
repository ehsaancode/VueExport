const blockImage = require("./react_parser_block_image");
const blockButton = require("./react_craete_block_button");
const parserFullWidth = require("./react_parser_full_width");
const parserDiv = require("./react_parser_div");
const parserFlex = require("./react_parser_flex");
const parserMainCanvas = require("./react_parser_main_canvas");
const parserIncrementCounter = require("./react_parser_increment_counter");
const parserAccordion = require("./react_parser_accordion");
const parserAccordionItem = require("./react_parser_accordionItem");
const parserWrap = require("./react_parser_wrap");
const parserTabBar = require("./react_parser_tabBar");
const parserTab = require("./react_parser_tab");
const parserTabBody = require("./react_parser_tabBody");
const parserTabHeader = require("./react_parser_tabHeader");
const parserFloatingButton = require("./react_parser_floating_button");
const parserDrawer = require("./react_parser_drawer");
const parserStickyHeader = require("./react_parser_sticky_header");
const parserHeaderBar = require("./react_parser_header_bar");
const parserForm = require("./react_parser_form");
const parserFormInputElement = require("./react_parser_form_input_element");
const parserInputText = require("./react_parser_input_text");
const parserInputTextEmail = require("./react_parser_input_text_email");
const parserInputTextNumber = require("./react_parser_input_text_number");
const parserRadio = require("./react_parser_radio");
const parserCheckBox = require("./react_parser_check_box");
const parserDropdown = require("./react_parser_drop_down");
const parserTextarea = require("./react_parser_textarea");
const parserNSection = require("./react_parser_nSection");
const parserElement = require("./react_parser_element");
const parserSection = require("./react_parser_section");
const parserMenuBar = require("./react_parser_menuBar");
const parserHMenuItem = require("./react_parser_hMenuItem");
const parserStack = require("./react_parser_stack");
const parserParallax = require("./react_parser_parallax");
const parserGroupParallax = require("./react_parser_group_parallax");
const parserRow = require("./react_parser_row");
const parserRepeat = require("./react_parser_repeat");
const parserTableWrapper = require("./react_parser_table_wrapper");
const parserTableSearch = require("./react_parser_table_search");
const parserInputSearch = require("./react_parser_input_search");
const parserIcon = require("./react_parser_icon");
const parserTable = require("./react_parser_table");
const parserMarquee = require("./react_parser_marquee");
const parserBlockText = require("./react_parser_block_text");
const parserHyperTextH6 = require("./react_parser_hypertext_textH6");
const parserHyperTextH5 = require("./react_parser_hypertext_textH5");
const parserHyperTextH4 = require("./react_parser_hypertext_textH4");
const parserHyperTextH3 = require("./react_parser_hypertext_textH3");
const parserHyperTextH2 = require("./react_parser_hypertext_textH2");
const parserHyperTextH1 = require("./react_parser_hypertext_textH1");
const parserSlider = require("./react_parser_slider");
const parserTablePagination = require("./react_parser_table_pagination");
const parserTablePaginationButton = require("./react_parser_table_pagination_button");
const parserPageIndicator = require("./react_parser_pageIndicator");
const parserTablePaginationInfo = require("./react_parser_table_pagination_info");
const parserTablePaginationRPP = require("./react_parser_table_pagination_RPP");
const parserTableFilter = require("./react_parser_table_filter");
const parserTableSort = require("./react_parser_table_sort");
const parserMap = require("./react_parser_map");
const parserBottomMenu = require("./react_parser_bottom_menu");
const parserVideo = require("./react_parser_video");
const parserNavbar = require("./react_parser_navbar");
const parserGallery = require("./react_parser_gallery");
const parserMasonary = require("./react_parser_masonary");
const parserProgressbarWithPercentage = require("./react_parser_progressbar_with_percentage");
const parserProgressbarWithStepper = require("./react_parser_progressbar_with_stepper");
const parserDashedProgressbar = require("./react_parser_dashed_progress_bar");
const parserProgressbarWithSlider = require("./react_parser_progress_bar_with_slider");
const parserBackDrop = require("./react_parser_back_drop");
const parserCarousel = require("./react_parser_carousel");

const parserLineChart = require("./react_parser_line_chart")
const parserAreaChart = require("./react_parser_area_chart")
const parserPieChart = require("./react_parser_pie_chart")
const parserBarChart = require("./react_parser_bar_chart")
const parserColumnChart = require("./react_parser_column_chart")

const parserPage = require("./react_parser_page");
const parserColumnHeaders = require("./react_parser_column_headers");
const parserColumnHeader = require("./react_parser_column_header");
const parserTableRows = require("./react_parser_table_rows");
const parserTableRow = require("./react_parser_table_row");
const parserTableCell = require("./react_parser_table_cell");

async function pageDesign(
  projectId = 0,
  pageId = 0,
  startingColum,
  fileName,
  jsonObject,
  parentWidth,
  parentHeight,
  isAbsoluteValue = false,
  parantType,
  commonStyle = {},
  parentId='0'
) {

  let objVisibility =
    jsonObject?.widgetDefaultData?.style?.layout?.visibility ?? "";

  if (objVisibility != "false") {
    try {
      let objectType = jsonObject["type"];
      if (objectType == "QMainCanvas") {
        let persMainCanvas = new parserMainCanvas.ParserMainCanvas(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persMainCanvas.parseMainCanvas();
      } else if (objectType == "QPage") {
        let parsePage = new parserPage.ParserPage(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await parsePage.parsePage();
      } else if (objectType == "QSlider") {
        let parseSlider = new parserSlider.ParserSlider(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await parseSlider.parseSlider();
      } else if (objectType == "QButton") { 
        let persBlockButton = new blockButton.ParseBlockButton(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persBlockButton.parseBlockButton();
      } else if (objectType == "QImageNetwork") {
        // await blockImage.parseBlockImage(startingColum, fileName, jsonObject);

        let persBlockImage = new blockImage.ParseBlockImage(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persBlockImage.parseBlockImage();
      } else if (objectType == "QTextH6") {
        let persHyperTextH6 = new parserHyperTextH6.ParseHyperTextH6(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persHyperTextH6.parserHyperTextH6();
      } else if (objectType == "QTextH5") {
        let persHyperTextH5 = new parserHyperTextH5.ParseHyperTextH5(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persHyperTextH5.parserHyperTextH5();
      } else if (objectType == "QTextH4") {
        let persHyperTextH4 = new parserHyperTextH4.ParseHyperTextH4(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persHyperTextH4.parserHyperTextH4();
      } else if (objectType == "QTextH3") {
        let persHyperTextH3 = new parserHyperTextH3.ParseHyperTextH3(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persHyperTextH3.parserHyperTextH3();
      } else if (objectType == "QTextH2") {
        let persHyperTextH2 = new parserHyperTextH2.ParseHyperTextH2(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persHyperTextH2.parserHyperTextH2();
      } else if (objectType == "QTextH1") {
        let persHyperTextH1 = new parserHyperTextH1.ParseHyperTextH1(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persHyperTextH1.parserHyperTextH1();
      } else if (objectType == "QParagraph" || objectType == "QText") {
        let persBlockText = new parserBlockText.ParseBlockText(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persBlockText.parseBlockText();
      } else if (objectType == "QFullWidth") { 
        let persFullWidth = new parserFullWidth.ParseFullWidth(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persFullWidth.parseFullWidth();
      } else if (objectType == "QDiv") {
        let persDiv = new parserDiv.ParserDiv(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persDiv.parseDiv();
      } else if (objectType == "QFlex") {
        let persFlex = new parserFlex.ParserFlex(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persFlex.parseFlex();
      } else if (objectType == "QWrap") {
        let persWrap = new parserWrap.ParserWrap(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persWrap.parseWrap();
      } else if (objectType == "QRow") {
        let persRow = new parserRow.ParserRow(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persRow.parseRow();
      } else if (objectType == "QParallax") {
        let persParallax = new parserParallax.ParserParallax(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persParallax.parserParallax();
      } else if (objectType == "QParallaxGroup") {
        let persGroupParallax = new parserGroupParallax.ParserGroupParallax(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persGroupParallax.parseGroupParallax();
      } else if (objectType == "QMarquee") {
        let parseMarquee = new parserMarquee.ParserMarquee(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await parseMarquee.parseMarquee();
      } else if (objectType == "QStack") {
        let persStack = new parserStack.ParserStack(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persStack.parseStack();
      } else if (objectType == "QIncrementCounter") {
        let persIncrementCounter =
          new parserIncrementCounter.ParserIncrementCounter(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persIncrementCounter.parseIncrementCounter();
      } else if (objectType == "QAccordion") {
        let persAccordion = new parserAccordion.ParserAccordion(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persAccordion.parseAccordion();
      } else if (objectType == "QAccordionItem") {
        let persAccordionItem = new parserAccordionItem.ParserAccordionItem(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persAccordionItem.parseAccordionItem();
      } else if (objectType == "QTabBar") {
        let persTabBar = new parserTabBar.ParserTabBar(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTabBar.parseTabBar();
      } else if (objectType == "QTabHeader") {
        let persTabHeader = new parserTabHeader.ParserTabHeader(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTabHeader.parseTabHeader();
      } else if (objectType == "QTabBody") {
        let persTabBody = new parserTabBody.ParserTabBody(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTabBody.parseTabBody();
      } else if (objectType == "QTab") {
        let persTab = new parserTab.ParserTab(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTab.parseTab();
      } else if (objectType == "QFloatingButton") {
        let persFloatingButton = new parserFloatingButton.ParserFloatingButton(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persFloatingButton.parseFloatingButton();
      } else if (objectType == "QDrawer") {
        let persDrawer = new parserDrawer.ParserDrawer(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persDrawer.parseDrawer();
      } else if (objectType == "QStickyHeader") {
        let persStickyHeader = new parserStickyHeader.ParserStickyHeader(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persStickyHeader.parseStickyHeader();
      } else if (objectType == "QHeaderBar") {
        let persHeaderBar = new parserHeaderBar.ParserHeaderBar(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persHeaderBar.parseHeaderBar();
      } else if (objectType == "QForm") {
        let persForm = new parserForm.ParserForm(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persForm.parseForm();
      } else if (objectType == "QFormItem") {
        let persFormInputElement =
          new parserFormInputElement.ParserFormInputElement(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType,
            parentId
          );
        await persFormInputElement.parseFormInputElement();
      } else if (objectType == "QInputText") {        
        let persInputText = new parserInputText.ParserInputText(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persInputText.parseInputText();
      } else if (objectType == "QInputTextEmail") {
        let persInputTextEmail = new parserInputTextEmail.ParserInputTextEmail(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persInputTextEmail.parseInputTextEmail();
      } else if (objectType == "QInputTextNumber") {
        let persInputTextNumber =
          new parserInputTextNumber.ParserInputTextNumber(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persInputTextNumber.parseInputTextNumber();
      } else if (objectType == "QRadio") {
        let persRadio = new parserRadio.ParserRadio(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persRadio.parseRadio();
      } else if (objectType == "QCheckBox") {
        let persCheckBox = new parserCheckBox.ParserCheckBox(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persCheckBox.parseCheckBox();
      } else if (objectType == "QDropdown") {
        let persDropdown = new parserDropdown.ParserDropdown(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persDropdown.parseDropdown();
      } else if (objectType == "QTextarea") {
        let persTextarea = new parserTextarea.ParserTextarea(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persTextarea.parseTextarea();
      } else if (objectType == "QNSection" || objectType == "QComponent") {
        let persNSection = new parserNSection.ParserNSection(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persNSection.parseNSection();
      }else if (objectType == "QElement") {
        let persElement  = new parserElement.ParserElement (
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persElement.parseElement();
      }
      
      else if (objectType == "Section" || objectType == "QSection") {
        let persSection = new parserSection.ParserSection(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          parentId
        );
        await persSection.parseSection();
      } else if (objectType == "QGallery") {
        let persGallery = new parserGallery.ParserGallery(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persGallery.parseGallery();
      } else if (objectType == "QCustomGallery") {
        let persMasonary = new parserMasonary.ParserMasonary(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persMasonary.parseMasonary();
      } else if (objectType == "QMenuBar") {
        let persMenuBar = new parserMenuBar.ParserMenuBar(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persMenuBar.parseMenuBar();
      } else if (objectType == "QHMenuItem") {
        let persHMenuItem = new parserHMenuItem.ParserHMenuItem(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persHMenuItem.parseHMenuItem();
      } else if (objectType == "QTableWrapper") {
        let persTableWrapper = new parserTableWrapper.ParserTableWrapper(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTableWrapper.parseTableWrapper();
      } else if (objectType == "QTableSearch") {
        let persTableSearch = new parserTableSearch.ParserTableSearch(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTableSearch.parseTableSearch();
      } else if (objectType == "QInputSearch") {
        let persInputSearch = new parserInputSearch.ParserInputSearch(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persInputSearch.parseInputSearch();
      } else if (objectType == "QIcon") {
        let persIcon = new parserIcon.ParserIcon(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
           isAbsoluteValue,
          parantType,
          parentId
        );
        await persIcon.parseIcon();
      } else if (objectType == "QTable") {
        let persTable = new parserTable.ParserTable(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          commonStyle
        );
        await persTable.parseTable();
      } else if (objectType == "QColumnHeaders") {
        let persColumnHeaders = new parserColumnHeaders.ParserColumnHeaders(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          commonStyle
        );
        await persColumnHeaders.parseColumnHeaders();
      } else if (objectType == "QColumnHeader") {
        let persColumnHeader = new parserColumnHeader.ParserColumnHeader(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persColumnHeader.parseColumnHeader();
      } else if (objectType == "QTableRows") {
        let persTableRows = new parserTableRows.ParserTableRows(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          commonStyle
        );
        await persTableRows.parseTableRows();
      } else if (objectType == "QTableRow") {
        let persTableRow = new parserTableRow.ParserTableRow(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType,
          commonStyle
        );
        await persTableRow.parseTableRow();
      } else if (objectType == "QTableCell") {
        let persTableCell = new parserTableCell.ParserTableCell(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTableCell.parseTableCell();
      } else if (objectType == "QTablePagination") {
        let persTablePagination =
          new parserTablePagination.ParserTablePagination(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persTablePagination.parseTablePagination();
      } else if (objectType == "QTablePaginationButton") {
        let persTablePaginationButton =
          new parserTablePaginationButton.ParserTablePaginationButton(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persTablePaginationButton.parseTablePaginationButton();
      } else if (objectType == "QPageIndicator") {
        let persPageIndicator = new parserPageIndicator.ParserPageIndicator(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persPageIndicator.parsePageIndicator();
      } else if (objectType == "QTablePaginationInfo") {
        let persTablePaginationInfo =
          new parserTablePaginationInfo.ParserTablePaginationInfo(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persTablePaginationInfo.parseTablePaginationInfo();
      } else if (objectType == "QTablePaginationRPP") {
        let persTablePaginationRPP =
          new parserTablePaginationRPP.ParserTablePaginationRPP(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persTablePaginationRPP.parseTablePaginationRPP();
      } else if (objectType == "QTableFilter") {
        let persTableFilter = new parserTableFilter.ParserTableFilter(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTableFilter.parseTableFilter();
      } else if (objectType == "QTableSort") {
        let persTableSort = new parserTableSort.ParserTableSort(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persTableSort.parseTableSort();
      } else if (objectType == "QRepeat") {
        let persRepeat = new parserRepeat.ParserRepeat(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persRepeat.parseRepeat();
      } else if (objectType == "QMap") {
        let persMap = new parserMap.ParserMap(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persMap.parseMap();
      } else if (objectType == "QVideoNetwork") {
        let persVideo = new parserVideo.ParserVideo(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persVideo.parseVideo();
      } else if (objectType == "QNavbar") {
        let persNavbar = new parserNavbar.ParserNavbar(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persNavbar.parseNavbar();
      } else if (objectType == "QBottomMenu") {
        let persBottomMenu = new parserBottomMenu.ParserBottomMenu(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persBottomMenu.parseBottomMenu();
      } else if (objectType == "QProgressbarWithPercentage") {
        let persProgressbarWithPercentage =
          new parserProgressbarWithPercentage.ParserProgressbarWithPercentage(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persProgressbarWithPercentage.parseProgressbarWithPercentage();
      } else if (objectType == "QProgressbarWithStepper") {
        let persProgressbarWithStepper =
          new parserProgressbarWithStepper.ParserProgressbarWithStepper(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persProgressbarWithStepper.parseProgressbarWithStepper();
      } else if (objectType == "QDashedProgressbar") {
        let persDashedProgressbar =
          new parserDashedProgressbar.ParserDashedProgressbar(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persDashedProgressbar.parseDashedProgressbar();
      } else if (objectType == "QProgressbarWithSlider") {
        let persProgressbarWithSlider =
          new parserProgressbarWithSlider.ParserProgressbarWithSlider(
            projectId,
            pageId,
            startingColum,
            fileName,
            jsonObject,
            parentWidth,
            parentHeight,
            isAbsoluteValue,
            parantType
          );
        await persProgressbarWithSlider.parseProgressbarWithSlider();
      } else if (objectType == "QBackDrop") {
        let persBackDrop = new parserBackDrop.ParserBackDrop(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persBackDrop.parseBackDrop();
      } else if (objectType == "QCarousel") {
        let persCarousel = new parserCarousel.ParserCarousel(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persCarousel.parseCarousel();


        
        //==== Charts ==============================
      } else if (objectType == "QLineChart") {
        let persLineChart = new parserLineChart.ParseLineChart(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persLineChart.parseLineChart();
      }

      else if (objectType == "QAreaChart") {
        let persAreaChart = new parserAreaChart.ParseAreaChart(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persAreaChart.parseAreaChart();
      }
      
      else if (objectType == "QPieChart") {
        let persPieChart = new parserPieChart.ParsePieChart(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persPieChart.parsePieChart();
      }

      else if (objectType == "QBarChart") {
        let persBarChart = new parserBarChart.ParseBarChart(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persBarChart.parseBarChart();
      }

      else if (objectType == "QColumnChart") {
        let persColumnChart = new parserColumnChart.ParseColumnChart(
          projectId,
          pageId,
          startingColum,
          fileName,
          jsonObject,
          parentWidth,
          parentHeight,
          isAbsoluteValue,
          parantType
        );
        await persColumnChart.parseColumnChart();
      }

      return "success";
    } catch (err) {
      console.error(err);
      return "failure";
    }
  }
}

exports.pageDesign = pageDesign;
// module.exports = {
//      pageDesign
// }
