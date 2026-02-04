<script>
import QFullWidth from "./qfullwidth/QFullWidth.vue";
import QRow from "./qrow/QRow.vue";
import QDiv from "./qdiv/QDiv.vue";
import QFlex from "./qflex/QFlex.vue";
import QParagraph from "./qparagraph/QParagraph.vue";
import QTextH6 from "./qtexth6/QTextH6.vue";
import QTextH5 from "./qtexth5/QTextH5.vue";
import QTextH4 from "./qtexth4/QTextH4.vue";
import QTextH3 from "./qtexth3/QTextH3.vue";
import QTextH2 from "./qtexth2/QTextH2.vue";
import QTextH1 from "./qtexth1/QTextH1.vue";
import QImage from "./qimage/QImage.vue";
import QButton from "./qbutton/QButton.vue";
import QParallax from "./qparallax/QParallax.vue";
import QHorizontalParallax from "./qparallax/QHorizontalParallax.vue";
import QMarquee from "./qmarquee/QMarquee.vue";
import QStack from "./qstack/QStack.vue";
import QIncrementCounter from "./qincrementcounter/QIncrementCounter.vue";
import QSlider from "./qslider/QSlider.vue";
import QAccordion from "./qaccordion/QAccordion.vue";
import QAccordionItem from "./qaccordion/QAccordionItem.vue";
import QAccordionBody from "./qaccordionbody/QAccordionBody.vue";
import QWrap from "./qwrap/QWrap.vue";
import QTabBar from "./qtab/QTabBar.vue";
import QTab from "./qtab/QTab.vue";
import QTabBody from "./qtab/QTabBody.vue";
import QTabHeader from "./qtab/QTabHeader.vue";
import QFloatingButton from "./qfloatingbutton/QFloatingButton.vue";
import QDrawer from "./qdrawer/QDrawer.vue";
import QDrawerBody from "./qdrawerbody/QDrawerBody.vue";
import QStickyHeader from "./qstickyheader/QStickyHeader.vue";
import QHeaderBar from "./qheaderbar/QHeaderBar.vue";
import QForm from "./qform/QForm.vue";
import QFormInputElement from "./qforminputelement/QFormInputElement.vue";
import QInputText from "./qinputtext/QInputText.vue";
import QTextArea from "./qtextarea/QTextArea.vue";
import QNSection from "./qnsection/QNSection.vue";
import QMenuBar from "./qmenubar/QMenuBar.vue";
import QHMenuItem from "./qhmenuitem/QHMenuItem.vue";
import QMenu from "./qmenu/QMenu.vue";
import QSubMenu from "./qsubmenu/QSubMenu.vue";
import QInputEmail from "./qinputemail/QInputEmail.vue";
import QInputNumber from "./qinputnumber/QInputNumber.vue";
import QRadio from "./qradio/QRadio.vue";
import QCheckBox from "./qcheckbox/QCheckbox.vue";
import QDropDown from "./qdropdown/QDropdown.vue";
import QRepeat from "./qrepeat/QRepeat.vue";
import QInputSearch from "./qinputsearch/QInputSearch.vue";
import QIcon from "./qicon/QIcon.vue";
import QPageIndicator from "./qpageindicator/QPageIndicator.vue";
import QMap from "./qmap/QMap.vue";
import QBottomMenu from "./qbottommenu/QBottomMenu.vue";
import QVideo from "./qvideo/QVideo.vue";
import QSection from "./qsection/QSection.vue";
import QNavbar from "./qnavbar/QNavbar.vue";
import QCustom from "./qcustom/QCustom.vue";
import QGallery from "./qgallery/QGallery.vue";
import QMasonary from "./qmasonary/QMasonary.vue";
import QBackDrop from "./qbackdrop/QBackDrop.vue";
import QCarousel from "./qcarousel/QCarousel.vue";
import QProgressbarWithPercentage from "./qprogressbarwithpercentage/QProgressbarWithPercentage.vue";
import QProgressbarWithStepper from "./qprogressbarwithstepper/QProgressbarWithStepper.vue";
import QDashedProgressbar from "./qdashedprogressbar/QDashedProgressbar.vue";
import QProgressbarWithSlider from "./qprogressbarwithslider/QProgressbarWithSlider.vue";
import QErrorMessage from "./qerrormessage/QErrorMessage.vue";
import QDatePicker from "./qdatepicker/QDatePicker.vue";
import QTimePicker from "./qtimepicker/QTimePicker.vue";
import QDateRangePicker from "./qdaterangepicker/QDateRangePicker.vue";

import QTableWrapper from "./qtable/qtablewrapper/QTableWrapper.vue"; 

import QTable from "./qtable/qtabledata/QTable.vue";
import QTableData from "./qtabledata/QTableData.vue";

import QColumnHeaders from "./qtable/qcolumnheaders/QColumnHeaders.vue";

import QColumnHeader from "./qtable/qcolumnheader/QColumnHeader.vue";

import QTableRows from "./qtable/qtablerows/QTableRows.vue";

import QTableRow from "./qtable/qtablerow/QTableRow.vue"; 

import QTableCell from "./qtable/qtablecell/QTableCell.vue";

import QTablePagination from "./qtable/qtablepagination/QTablePagination.vue";
import QTablePaginationButton from "./qtable/qtablepaginationbutton/QTablePaginationButton.vue";
import QTablePaginationInfo from "./qtable/qtablepaginationinfo/QTablePaginationInfo.vue";
import QTablePaginationRPP from "./qtable/qtablepaginationrpp/QTablePaginationRPP.vue";
import QTableSort from "./qtable/qtablesort/QTableSort.vue";
import QTableFilter from "./qtable/qtablefilter/QTableFilter.vue";
import QTableSearch from "./qtable/qtablesearch/QTableSearch.vue";
import QMultiSelectDropdown from "./qmultiselectdropdown/QMultiSelectDropdown.vue";
import QDynamicRow from "./qdynamicrow/QDynamicRow.vue";
import QActionFlow from "./qactionflow/QActionFlow.vue";
import QLineChart from "./qcharts/QLineChart.vue";
import QAreaChart from "./qcharts/QAreaChart.vue";
import QBarChart from "./qcharts/QBarChart.vue";
import QColumnChart from "./qcharts/QColumnChart.vue";
import QPieChart from "./qcharts/QPieChart.vue";

import QModalContainer from "./qmodal/QModalContainer.vue";

const componentsMap = {
  QLineChart,
  QAreaChart,
  QBarChart,
  QColumnChart,
  QPieChart,
  QFullWidth,
  QRow,
  QDiv,
  QParagraph,
  QTextH6,
  QTextH5,
  QTextH4,
  QTextH3,
  QTextH2,
  QTextH1,
  QImage,
  QButton,
  QParallax,
  QMarquee,
  QStack,
  QIncrementCounter,
  QSlider,
  QAccordion,
  QAccordionItem,
  QAccordionBody,
  QWrap,
  QHorizontalParallax,
  QTabBar,
  QTab,
  QTabBody,
  QTabHeader,
  QFloatingButton,
  QDrawer,
  QDrawerBody,
  QStickyHeader,
  QHeaderBar,
  QForm,
  QFormInputElement,
  QInputText,
  QTextArea,
  QNSection,
  QMenuBar,
  QHMenuItem,
  QMenu,
  QSubMenu,
  QInputEmail,
  QInputNumber,
  QRadio,
  QCheckBox,
  QDropDown,

  QTableWrapper,
  QTable,
  QTableData,
  QColumnHeaders,
  QColumnHeader,
  QTableRows,
  QTableRow,
  QTableCell,
  QTableSearch,

  QTablePagination,
  QTablePaginationButton,
  QPageIndicator,
  QTablePaginationInfo,
  QTablePaginationRPP,
  QTableSort,
  QTableFilter,
  QInputSearch,
  QRepeat,
  QIcon,
  QMap,
  QBottomMenu,
  QFlex,
  QVideo,
  QSection,
  QNavbar,
  QCustom,
  QGallery,
  QMasonary,
  QProgressbarWithPercentage,
  QProgressbarWithStepper,
  QDashedProgressbar,
  QProgressbarWithSlider,
  QBackDrop,
  QCarousel,
  QErrorMessage,
  QDatePicker,
  QTimePicker,
  QDateRangePicker,
  QMultiSelectDropdown,
  QDynamicRow,
  QActionFlow,
  QModalContainer
};

export default componentsMap;
</script>