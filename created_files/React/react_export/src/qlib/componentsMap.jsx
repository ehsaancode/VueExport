import QFullWidth from "./qfullwidth/QFullWidth";
import QRow from "./qrow/QRow";
import QDiv from "./qdiv/QDiv";
import QFlex from "./qflex/QFlex";
import QParagraph from "./qparagraph/QParagraph";
import QTextH6 from "./qtexth6/QTextH6";
import QTextH5 from "./qtexth5/QTextH5";
import QTextH4 from "./qtexth4/QTextH4";
import QTextH3 from "./qtexth3/QTextH3";
import QTextH2 from "./qtexth2/QTextH2";
import QTextH1 from "./qtexth1/QTextH1";
import QImage from "./qimage/QImage";
import QButton from "./qbutton/QButton";
import QParallax from "./qparallax/QParallax";
import QHorizontalParallax from "./qparallax/QHorizontalParallax";
import QMarquee from "./qmarquee/QMarquee";
import QStack from "./qstack/QStack";
import QIncrementCounter from "./qincrementcounter/QIncrementCounter";
import QSlider from "./qslider/QSlider";
import QAccordion from "./qaccordion/QAccordion";
import QAccordionItem from "./qaccordion/QAccordionItem";
import QAccordionBody from "./qaccordionbody/QAccordionBody";
import QWrap from "./qwrap/QWrap";
import QTabBar from "./qtab/QTabBar";
import QTab from "./qtab/QTab";
import QTabBody from "./qtab/QTabBody";
import QTabHeader from "./qtab/QTabHeader";
import QFloatingButton from "./qfloatingbutton/QFloatingButton";
import QDrawer from "./qdrawer/QDrawer";
import QDrawerBody from "./qdrawerbody/QDrawerBody";
import QStickyHeader from "./qstickyheader/QStickyHeader";
import QHeaderBar from "./qheaderbar/QHeaderBar";
import QForm from "./qform/QForm";
import QFormInputElement from "./qforminputelement/QFormInputElement";
import QInputText from "./qinputtext/QInputText";
import QTextArea from "./qtextarea/QTextArea";
import QNSection from "./qnsection/QNSection";
import QMenuBar from "./qmenubar/QMenuBar";
import QHMenuItem from "./qhmenuitem/QHMenuItem";
import QMenu from "./qmenu/QMenu";
import QSubMenu from "./qsubmenu/QSubMenu";
import QInputEmail from "./qinputemail/QInputEmail";
import QInputNumber from "./qinputnumber/QInputNumber";
import QRadio from "./qradio/QRadio";
import QCheckBox from "./qcheckbox/QCheckBox";
import QDropDown from "./qdropdown/QDropdown";
import QRepeat from "./qrepeat/QRepeat";
import QInputSearch from "./qinputsearch/QInputSearch";
import QIcon from "./qicon/QIcon";
import QPageIndicator from "./qpageindicator/QPageIndicator";
import QMap from "./qmap/QMap";
import QBottomMenu from "./qbottommenu/QBottomMenu";
import QVideo from "./qvideo/QVideo";
import QSection from "./qsection/QSection";
import QNavbar from "./qnavbar/QNavbar";
import QCustom from "./qcustom/QCustom";
import QGallery from "./qgallery/QGallery";
import QMasonary from "./qmasonary/QMasonary";
import QBackDrop from "./qbackdrop/QBackDrop";
import QCarousel from "./qcarousel/QCarousel";
import QProgressbarWithPercentage from "./qprogressbarwithpercentage/QProgressbarWithPercentage";
import QProgressbarWithStepper from "./qprogressbarwithstepper/QProgressbarWithStepper";
import QDashedProgressbar from "./qdashedprogressbar/QDashedProgressbar";
import QProgressbarWithSlider from "./qprogressbarwithslider/QProgressbarWithSlider";
import QErrorMessage from "./qerrormessage/QErrorMessage";
import QDatePicker from "./qdatepicker/QDatePicker";
import QTimePicker from "./qtimepicker/QTimePicker";
import QDateRangePicker from "./qdaterangepicker/QDateRangePicker";

import QTableWrapper from "./qtable/qtablewrapper/QTableWrapper"; 

import QTable from "./qtable/qtabledata/QTable";

import QColumnHeaders from "./qtable/qcolumnheaders/QColumnHeaders";

import QColumnHeader from "./qtable/qcolumnheader/QColumnHeader";

import QTableRows from "./qtable/qtablerows/QTableRows";

import QTableRow from "./qtable/qtablerow/QTableRow"; 

import QTableCell from "./qtable/qtablecell/QTableCell";

import QTablePagination from "./qtable/qtablepagination/QTablePagination";
import QTablePaginationButton from "./qtable/qtablepaginationbutton/QTablePaginationButton";
import QTablePaginationInfo from "./qtable/qtablepaginationinfo/QTablePaginationInfo";
import QTablePaginationRPP from "./qtable/qtablepaginationrpp/QTablePaginationRPP";
import QTableSort from "./qtable/qtablesort/QTableSort";
import QTableFilter from "./qtable/qtablefilter/QTableFilter";
import QTableSearch from "./qtable/qtablesearch/QTableSearch";
import QMultiSelectDropdown from "./qmultiselectdropdown/QMultiSelectDropdown";
import QDynamicRow from "./qdynamicrow/QDynamicRow";
import QActionFlow from "./qactionflow/QActionFlow";
import QLineChart from "./qcharts/QLineChart";
import QAreaChart from "./qcharts/QAreaChart";
import QBarChart from "./qcharts/QBarChart";
import QColumnChart from "./qcharts/QColumnChart";
import QPieChart from "./qcharts/QPieChart";

import QModalContainer from "./qmodal/QModalContainer";


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
