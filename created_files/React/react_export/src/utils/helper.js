export const trimString = (string) => {
  let trimmedString = string.trim("");
  return trimmedString;
};

export const checkEmpty = (mixedVar) => {
  if (mixedVar == null) {
    return true;
  } else if (typeof mixedVar === "object") {
    return Object.getOwnPropertyNames(mixedVar).length === 0;
  } else {
    let undef;
    let i;
    let len;
    let emptyValues = [
      undef,
      null,
      "null",
      false,
      0,
      "",
      "0",
      "0.00",
      "0000-00-00 00:00:00",
      "0.0",
      "empty",
      undefined,
      "undefined",
    ];
    try {
      mixedVar = mixedVar?.trim();
    } catch (e) {
      // console.log(e);
    }
    for (i = 0, len = emptyValues.length; i < len; i++) {
      if (mixedVar === emptyValues[i]) {
        return true;
      }
    }
  }
  return false;
};

export const isNumber = (numb) => {
  return !isNaN(parseFloat(numb)) && isFinite(numb);
};

export const objectSize = (obj) => {
  let size = 0,
    key;
  for (key in obj) {
    if (Object.getOwnPropertyNames(key)) size++;
  }
  return size;
};

export const objectNext = (obj, key) => {
  let keys = Object.keys(obj),
    i = keys.indexOf(key);
  return i !== -1 && keys[i + 1] && obj[keys[i + 1]];
};

export const numberFormat = (number, decimals, dec_point, thousands_sep) => {
  number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "",
    toFixedFix = function (n, prec) {
      let k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };
  // Fix for IE checkFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
};

export const formatTotal = (num) => {
  return numberFormat(Math.round(num * 100) / 100, 2, ".", "");
};

export const checkInt = (num) => {
  num = parseInt(num);
  if (isNaN(num) || num == "" || num == 0 || num == "0") {
    return 0;
  } else {
    return num;
  }
};

export const checkFloat = (num) => {
  num = parseFloat(num);
  if (isNaN(num) || num == 0.0 || num == "" || num == 0 || num == "0") {
    return 0.0;
  } else {
    num = formatTotal(num);
    num = parseFloat(num);
    if (isNaN(num) || num == 0.0 || num == "" || num == 0 || num == "0") {
      return 0.0;
    } else {
      return num;
    }
  }
};

export const getNumber = (num) => {
  num = checkInt(num);
  return new Array(num);
};

export const splitUKPostcode = (basketpostcode) => {
  let posOfSpace;
  let str = basketpostcode;
  if ((posOfSpace = str.indexOf(" ")) !== -1) {
    return str.substr(0, posOfSpace);
  }
  if (str.length < 5) {
    return basketpostcode;
  }
  let shortened = str.substr(0, 5);
  if (
    String(parseInt(shortened.substr(4, 1))) === String(shortened.substr(4, 1))
  ) {
    return shortened.substr(0, 4);
  } else {
    if (
      String(parseInt(shortened.substr(3, 1))) ===
      String(shortened.substr(3, 1))
    ) {
      return shortened.substr(0, 3);
    } else {
      return shortened.substr(0, 2);
    }
  }
};

export const substrReplace = (str, replace, start, length) => {
  if (start < 0) {
    // start position in str
    start = start + str?.length;
  }
  length = length !== undefined ? length : str?.length;
  if (length < 0) {
    length = length + str?.length - start;
  }

  return [
    str?.slice(0, start),
    replace?.substr(0, length),
    replace?.slice(length),
    str?.slice(start + length),
  ].join("");
};

export const stringrpl = (x, r, str) => {
  let out = "";
  let temp = str?.substr(x);
  out = substrReplace(str, r, x);
  out += temp;
  return out;
};

export const splitUKPostcodeFormat = (mypostcode) => {
  let postcode = mypostcode?.trim();
  postcode = postcode?.replace(/ /g, "");
  var test = postcode;
  if (test?.substr(-3) == " ") {
    // eslint-disable-next-line no-self-assign
    postcode = postcode;
  } else {
    test = stringrpl(-3, " ", test);
    postcode = test;
  }
  return postcode;
};

export const formatPostcode = (mypostcode) => {
  mypostcode = splitUKPostcodeFormat(mypostcode);
  if (!checkEmpty(mypostcode)) {
    return mypostcode.toUpperCase();
  } else {
    return "";
  }
};

export const getDateField = (prefix, suffix) => {
  let d = new Date();
  let weekday = new Array(7);
  weekday[0] = prefix + "Sunday" + suffix;
  weekday[1] = prefix + "Monday" + suffix;
  weekday[2] = prefix + "Tuesday" + suffix;
  weekday[3] = prefix + "Wednesday" + suffix;
  weekday[4] = prefix + "Thursday" + suffix;
  weekday[5] = prefix + "Friday" + suffix;
  weekday[6] = prefix + "Saturday" + suffix;
  return weekday[d.getDay()];
};

export const getCur = (type, separator) => {
  let d = new Date();
  let n = "0";
  if (type == "day") {
    let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    n = weekday[d.getDay()];
  } else if (type == "date") {
    let month = d.getUTCMonth() + 1; //months from 1-12
    let day = d.getUTCDate();
    let year = d.getUTCFullYear();
    n = year + separator + month + separator + day;
  } else if (type == "time") {
    let h = d.getHours(); // => 9
    let m = d.getMinutes(); // =>  30
    let s = d.getSeconds(); // => 51
    n = h + separator + m + separator + s;
  }
  return n;
};

export const showMessageBox = (message, type) => {
  let showMessage = false;
  let showMessageText = "";
  let showMessageStyle = "";
  //alert(message);
  let closeBox = "";

  if (type == "error") {
    showMessageStyle = { "background-color": "red" };
  } else if (type == "success") {
    showMessageStyle = { "background-color": "#8ecc00" };
  } else {
    showMessageStyle = { "background-color": "" };
  }

  showMessageText = closeBox + message;
  showMessage = true;

  setTimeout(function () {
    showMessageText = "";
    showMessage = false;
  }, 2000);
};

export const minutesBetween = (date1, date2) => {
  //Get 1 day in milliseconds
  let one_hour = 1000 * 60; //*60*24;
  date1 = new Date(date1);
  date2 = new Date(date2);
  // Convert both dates to milliseconds
  let date1_ms = date1.getTime();
  let date2_ms = date2.getTime();
  // Calculate the difference in milliseconds
  let difference_ms = date2_ms - date1_ms;
  // Convert back to days and return
  return Math.round(difference_ms / one_hour);
};

export const increaseBrightness = (hex, percent) => {
  // strip the leading # if it's there
  hex = hex.replace(/^\s*#|\s*$/g, "");

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (hex.length == 3) {
    hex = hex.replace(/(.)/g, "$1$1");
  }

  var r = parseInt(hex.substr(0, 2), 16),
    g = parseInt(hex.substr(2, 2), 16),
    b = parseInt(hex.substr(4, 2), 16);

  return (
    "#" +
    (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).substr(1) +
    (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
  );
};

export const hideModal = (modal) => {
  if (modal == 0) {
    let modal = { visible: 0 };
    if (modal.windows.length > 0) {
      for (var i in modal.windows) {
        [modal.windows[i]] = "";
      }
    }
    modal.windows = [];
  } else {
    modal.windows.pop();
    if (modal.windows.length <= 0) {
      modal.visible = 0;
    }
    [modal] = "";
  }
};

export const showModal = (window) => {
  let modal = { visible: 1 };
  modal.windows.push(window);
};

export const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

export const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const getDistanceFromLatLonInMile = (lat1, lon1, lat2, lon2) => {
  let R = 6371; // Radius of the earth in km
  let M = 3959; // Radius of the earth in mile
  let dLat = deg2rad(lat2 - lat1); // deg2rad below
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = M * c; // Distance in km
  return d;
};

export const jsUcfirst = (string) => {
  var ret = "";
  try {
    ret = string.charAt(0).toUpperCase() + string.slice(1);
  } catch (e) {
    /* empty */
  }
  return ret;
};

export const cleanString = (str) => {
  if (checkEmpty(str)) {
    return str;
  }

  if (parseInt(str)) {
    return str;
  }

  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap Ã± for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-") // collapse dashes
    .replace(/\//g, "-"); // collapse dashes
  str = str.replace("/", "-");
  //store_name = store_name.trim();
  str = str.toLowerCase();
  //store_name = store_name.replace("![^a-z0-9]+!i", "-")
  return str;
};

export const cleanPostcode = (string) => {
  string = string?.trim();
  string = string?.split(" ").join("");
  string = string?.replace(" ", "");
  string = string?.replace("/[^A-Za-z0-9]/", "");
  string = string?.replace("/-+/", "");
  string = strtolower(string);
  return string;
};

export const clearConsole = () => {
  console.clear();
};

export const strtolower = (string) => {
  string = string?.trim();
  string = string.toLowerCase();
  return string;
};

export const objectKeys = (obj) => {
  return Object.keys(obj);
};

export const resetObject = (obj) => {
  let tmpObj = {};
  let r = 0;
  Object.keys(obj ?? {}).forEach((k) => {
    tmpObj[r] = obj[k];
    r++;
  });
  return tmpObj;
};

export const validatePostCode = (postcode) => {
  let postcodeRegEx =
    /^(GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\d{1,4})$/i;
  postcodeRegEx =
    /^(GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\d{1,4})$/i;
  if (postcodeRegEx.test(postcode)) {
    return true;
  }
  return false;
};

export const adjustTextareaHeight = ($event) => {
  let o = $event.currentTarget;
  //console.log(o.value);
  if (o.value == "") {
    o.style.height = "46px";
  } else {
    o.style.height = "1px";
    o.style.height = 5 + o.scrollHeight + "px";
  }
};

export const getMobileOperatingSystem = () => {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
};

export const getRandomImageInt = () => {
  let min = 1;
  var max = 4;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const copyObject = (object) => JSON.parse(JSON.stringify(object));

export const completeDateFormatter = (data) => {
  var currentTime = new Date();
  var dateItem = data.split(" ");
  var shortDay = "";
  var shortMonth = "";
  var conditionalYear = "";
  var finalDateString = "";
  for (var i = 0; i < dateItem.length; i++) {
    if (i === 2) {
      shortDay = dateItem[i].substr(0, 3);
    }
    if (i === 4) {
      shortMonth = dateItem[i].substr(0, 3);
    }
    if (i === 5) {
      if (currentTime.getFullYear().toString() === dateItem[i]) {
        conditionalYear = "";
      } else {
        conditionalYear = dateItem[i];
      }
    }
  }
  finalDateString =
    dateItem[0] +
    " " +
    dateItem[1] +
    " " +
    shortDay +
    " " +
    dateItem[3] +
    " " +
    shortMonth +
    " " +
    conditionalYear;
  return finalDateString;
};

export const formatTimeAMPMDayMonthYear = (date) => {
  var d = new Date(date);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var str = dayNames[d.getDay()];

  var hours = d.getHours();
  var minutes = d.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return completeDateFormatter(
    strTime +
      " " +
      str +
      " " +
      d.getDate() +
      " " +
      monthNames[d.getMonth()] +
      " " +
      d.getFullYear()
  );
};

export const prepareAddressFormat = (
  line1 = "",
  line2 = "",
  city = "",
  postcode = ""
) => {
  var address = "";
  if (!checkEmpty(line1)) {
    address += line1;
  }
  if (!checkEmpty(line2)) {
    if (!checkEmpty(address)) {
      address += ", ";
    }
    address += line2;
  }

  if (!checkEmpty(postcode)) {
    if (!checkEmpty(address)) {
      address += ", ";
    }
    address += postcode;
  }

  if (!checkEmpty(city)) {
    if (!checkEmpty(address)) {
      address += ", ";
    }
    address += city;
  }
  return address;
};

export const prepareOrderTracing = (orderStatus, deliveryType) => {
  // console.log(orderStatus);
  let checkArray = ["LIVE", "DONE"];
  if (deliveryType == "Delivery") {
    if (checkArray.includes(orderStatus.delivered)) {
      return 4;
    } else if (checkArray.includes(orderStatus.pickedup)) {
      return 3;
    } else if (checkArray.includes(orderStatus.prepared)) {
      return 2;
    } else if (checkArray.includes(orderStatus.accepted)) {
      return 1;
    } else {
      return 0;
    }
  } else {
    if (checkArray.includes(orderStatus.delivered)) {
      return 3;
    } else if (checkArray.includes(orderStatus.prepared)) {
      return 2;
    } else if (checkArray.includes(orderStatus.accepted)) {
      return 1;
    } else {
      return 0;
    }
  }
};

export const isValidDateTime = (dateTimeString) => {
  // Regular expression to match the date-time format
  const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

  // Check if the string matches the format
  if (!regex.test(dateTimeString)) {
    return false;
  }

  // Parse the date components
  const [datePart, timePart] = dateTimeString.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  // Create a Date object
  const date = new Date(year, month - 1, day, hour, minute, second);

  // Check if the date is valid
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) {
    return false;
  }

  return true;
};

export const checkDoSticky = () => {
  const viewportHeight = window.innerHeight;
  const mainDiv = document.getElementById("main_div");
  if (mainDiv !== null) {
    const elementHeight = mainDiv ? mainDiv.offsetHeight : 0;
    if (checkInt(elementHeight) > checkInt(viewportHeight) + 40) {
      return true;
    } else {
      return false;
    }
  }
  return true;
};

export const addLeadingZero = (mobileNumber) => {
  mobileNumber = mobileNumber.toString();
  if (!mobileNumber.startsWith("0")) {
    mobileNumber = "0" + mobileNumber;
  }

  return mobileNumber;
};

export const capitalizeString = (string) => {
  let text = string.replaceAll("-", " ");
  let splittedText = text.split(" ");
  let capitalizedString = "";
  splittedText.forEach((split) => {
    capitalizedString = capitalizedString + " " + capitalizeFirstLetter(split);
  });
  return capitalizedString;
};

const screenWidth = window.screen.width; // Gets the current screen width
const screenHeight = window.innerHeight; // Gets the current screen height

export const convertedWidth = (referenceWidth, width, paddingMargin) => {
  if (referenceWidth !== 0 && referenceWidth === width) {
    return screenWidth - paddingMargin - getVerticalScrollbarWidth();
  } else if (width > screenWidth) {
    return screenWidth - paddingMargin - getVerticalScrollbarWidth();
  } else {
    return width; //(width*(screenWidth/referenceWidth))-paddingMargin- getVerticalScrollbarWidth();
  }
};

export const convertedHeight = (referenceHeight, height, paddingMargin) => {
  if (
    (referenceHeight !== 0 && referenceHeight === height) ||
    height > screenHeight
  ) {
    return screenHeight - paddingMargin - 0;
  } else {
    //alert((height*(screenHeight/referenceHeight))-paddingMargin)
    return height * (screenHeight / referenceHeight) - paddingMargin - 0;
  }
};

function getVerticalScrollbarWidth() {
  // Create a temporary element to measure the vertical scrollbar
  const scrollDiv = document.createElement("div");

  // Apply styles to force a vertical scrollbar
  scrollDiv.style.width = "100px";
  scrollDiv.style.height = "100px";
  scrollDiv.style.overflowY = "scroll"; // Ensure vertical scroll
  scrollDiv.style.position = "absolute";
  scrollDiv.style.top = "-9999px";

  document.body.appendChild(scrollDiv);

  // Measure the difference between offset and client width
  const verticalScrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  // Cleanup
  document.body.removeChild(scrollDiv);

  return verticalScrollbarWidth;
}

export const computeMainAlignment = (value) => {
  switch (value) {
    case "align_right":
      return "flex-end";
    case "align_center":
      return "center";
    case "space_between":
      return "space-between";
    case "align_start":
      return "flex-start";
    case "align_end":
      return "flex-end";
    case "space_evenly":
      return "space-evenly";
    case "align_left":
      return "flex-start"; // 'flex-left' is not valid CSS
    default:
      return "";
  }
};

export const computeTextAlignment = (value) => {
  switch (value) {
    case "align_right":
      return "right";
    case "align_center":
      return "center";
    case "space_between":
      return "space-between";
    case "align_start":
      return "left";
    case "align_end":
      return "right";
    case "space_evenly":
      return "space-evenly";
    case "align_left":
      return "left"; // 'flex-left' is not valid CSS
    default:
      return "";
  }
};

export const generateStyle = ({
  width = "",
  height,
  isAbsoluteValue,
  positionedLeft,
  positionedTop,
  positionedRight,
  positionedBottom,
  bgColor,
  bgUrl,
  color,
  borderTLR,
  borderTRR,
  borderBLR,
  borderBRR,
  borderTW,
  borderBW,
  borderLW,
  borderRW,
  borderTC,
  borderBC,
  borderLC,
  borderRC,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  overflow,
  mainAlignment,
  crossAlignment,
  onClick,
  isDraggable,
  zIndex,
  fontSize,
  fontWeight,
  textAlign,
  fontFamily,
  fontStyle,
  imageFit,
  decoration,
  textDirection,

  boxShadow,
  backgroundRepeat,
  backgroundSize,
  borderStyle,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  overflowX,
  overflowY,
  positionType,
  textShadow,
  foreground,
}) => {
  let backgroundSizeValue;

  switch (backgroundSize) {
    case "cover":
      backgroundSizeValue = "cover";
      break;
    case "contain":
      backgroundSizeValue = "contain";
      break;
    case "fill":
      backgroundSizeValue = "100% 100%";
      break;
    case "fitHeight":
      backgroundSizeValue = "auto 100%";
      break;
    case "fitWidth":
      backgroundSizeValue = "100% auto";
      break;
    case "none":
      backgroundSizeValue = "auto";
      break;
    default:
      backgroundSizeValue = "100% 100%";
  }

  return {
    width: `${width}`,
    minWidth: `${minWidth}`,
    maxWidth: `${maxWidth}`,
    height: `${height}`,
    minHeight: `${minHeight}`,
    maxHeight: `${maxHeight}`,
    position: isAbsoluteValue == "true" ? "absolute" : positionType,
    left: positionedLeft,
    top: positionedTop,
    right: positionedRight,
    bottom: positionedBottom,
    ...(typeof bgColor === "string" &&
      bgColor.trim() !== "" &&
      bgColor !== "undefined" && { backgroundColor: bgColor }),
    backgroundRepeat: backgroundRepeat,
    ...(borderTLR && {
      borderTopLeftRadius: `${borderTLR}`,
    }),
    ...(borderTRR && {
      borderTopRightRadius: `${borderTRR}`,
    }),
    ...(borderBLR && {
      borderBottomLeftRadius: `${borderBLR}`,
    }),
    ...(borderBRR && {
      borderBottomRightRadius: `${borderBRR}`,
    }),
    ...(borderTW || borderBW || borderLW || borderRW
      ? {}
      : {
          // border: `${borderWidth || 1}px solid ${borderColor || "transparent"}`,
        }),
    ...(borderTW && {
      borderTop: `${borderTW} ${borderStyle} ${borderTC || "transparent"}`,
    }),
    ...(borderBW && {
      borderBottom: `${borderBW} ${borderStyle} ${borderBC || "transparent"}`,
    }),
    ...(borderLW && {
      borderLeft: `${borderLW} ${borderStyle} ${borderLC || "transparent"}`,
    }),
    ...(borderRW && {
      borderRight: `${borderRW} ${borderStyle} ${borderRC || "transparent"}`,
    }),
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    boxShadow: boxShadow,
    ...(bgUrl &&
      bgUrl !== "undefined" &&
      bgUrl !== undefined && {
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: backgroundSizeValue,

      }),
    ...(bgColor &&
      (bgColor.includes("linear-gradient") ||
        bgColor.includes("radial-gradient")) && {
        backgroundImage: bgColor,
      }),

    overflowX: overflowX,
    overflowY: overflowY,
    color: color || "",
    justifyContent: computeMainAlignment(mainAlignment),
    alignItems: computeMainAlignment(crossAlignment),
    cursor: onClick === "Yes" ? "pointer" : isDraggable ? "move" : "",
    zIndex,
    fontSize,
    fontWeight,
    textAlign: computeTextAlignment(textAlign),
    fontFamily: fontFamily != "undefined" ? fontFamily : "",
    fontStyle,
    objectFit: imageFit && imageFit != "undefined" ? imageFit : "",
    textDecoration: decoration,
    direction: textDirection,
    textShadow: textShadow,
  };
};

export const generateSearchStyle = ({
  width = "",
  height,
  isAbsoluteValue,
  positionedLeft,
  positionedTop,
  positionedRight,
  positionedBottom,
  bgColor,
  bgUrl,
  color,
  borderTLR,
  borderTRR,
  borderBLR,
  borderBRR,
  borderTW,
  borderBW,
  borderLW,
  borderRW,
  borderTC,
  borderBC,
  borderLC,
  borderRC,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  overflow,
  mainAlignment,
  crossAlignment,
  onClick,
  isDraggable,
  zIndex,
  fontSize,
  fontWeight,
  textAlign,
  fontFamily,
  fontStyle,
  imageFit,
  decoration,
  textDirection,

  boxShadow,
  backgroundRepeat,
  backgroundSize,
  borderStyle,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  overflowX,
  overflowY,
  positionType,
}) => {
  return {
    width: `${width}`,
    minWidth: `${minWidth}`,
    maxWidth: `${maxWidth}`,
    height: `${height}`,
    minHeight: `${minHeight}`,
    maxHeight: `${maxHeight}`,
    position: isAbsoluteValue == "true" ? "absolute" : positionType,
    left: positionedLeft,
    top: positionedTop,
    right: positionedRight,
    bottom: positionedBottom,
    ...(typeof bgColor === "string" &&
      bgColor.trim() !== "" &&
      bgColor !== "undefined" && { backgroundColor: bgColor }),
    backgroundRepeat: backgroundRepeat,
    backgroundSize: backgroundSize,
    ...(borderTLR && {
      borderTopLeftRadius: `${borderTLR}`,
    }),
    ...(borderTRR && {
      borderTopRightRadius: `${borderTRR}`,
    }),
    ...(borderBLR && {
      borderBottomLeftRadius: `${borderBLR}`,
    }),
    ...(borderBRR && {
      borderBottomRightRadius: `${borderBRR}`,
    }),
    ...(borderTW || borderBW || borderLW || borderRW
      ? {}
      : {
          // border: `${borderWidth || 1}px solid ${borderColor || "transparent"}`,
        }),
    ...(borderTW && {
      borderTop: `${borderTW} ${borderStyle} ${borderTC || "transparent"}`,
    }),
    ...(borderBW && {
      borderBottom: `${borderBW} ${borderStyle} ${borderBC || "transparent"}`,
    }),
    ...(borderLW && {
      borderLeft: `${borderLW} ${borderStyle} ${borderLC || "transparent"}`,
    }),
    ...(borderRW && {
      borderRight: `${borderRW} ${borderStyle} ${borderRC || "transparent"}`,
    }),
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    boxShadow: boxShadow,
    ...(bgUrl &&
      bgUrl !== "undefined" &&
      bgUrl !== undefined && {
        backgroundImage: `url(${bgUrl})`,
      }),
    ...(bgColor &&
      (bgColor.includes("linear-gradient") ||
        bgColor.includes("radial-gradient")) && {
        backgroundImage: bgColor,
      }),

    overflowX: overflowX,
    overflowY: overflowY,
    color: color || "",
    justifyContent: computeMainAlignment(mainAlignment),
    alignItems: computeMainAlignment(crossAlignment),
    cursor: onClick === "Yes" ? "pointer" : isDraggable ? "move" : "",
    zIndex,
    fontSize: fontSize,
    fontWeight,
    textAlign: computeTextAlignment(textAlign),
    fontFamily: fontFamily != "undefined" ? fontFamily : "",
    fontStyle,
    objectFit: imageFit && imageFit != "undefined" ? imageFit : "",
    textDecoration: decoration,
    direction: textDirection,
  };
};


export class HexToFilter {
  constructor() {
    // Predefined filters for common colors (for performance)
    this.predefinedFilters = {
      // Pinks & Purples
      "#ff69b4": "invert(72%) sepia(34%) saturate(1623%) hue-rotate(295deg) brightness(102%) contrast(101%)",
      "#800080": "invert(17%) sepia(95%) saturate(741%) hue-rotate(281deg) brightness(60%) contrast(120%)",
      // Teal & Cyan
      "#00ffff": "invert(78%) sepia(11%) saturate(2819%) hue-rotate(145deg) brightness(91%) contrast(100%)",
      "#008080": "invert(41%) sepia(21%) saturate(1045%) hue-rotate(144deg) brightness(92%) contrast(101%)",
      // Neutrals
      "#ffffff": "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
      "#000000": "invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)",
      // Red shades
      "#ff0000": "invert(16%) sepia(97%) saturate(7471%) hue-rotate(1deg) brightness(101%) contrast(116%)",
      "#800000": "invert(13%) sepia(94%) saturate(2000%) hue-rotate(0deg) brightness(50%) contrast(120%)",
      // Green shades
      "#00ff00": "invert(62%) sepia(95%) saturate(458%) hue-rotate(66deg) brightness(104%) contrast(103%)",
      "#008000": "invert(27%) sepia(89%) saturate(452%) hue-rotate(70deg) brightness(97%) contrast(102%)",
      // Blue shades
      "#0000ff": "invert(18%) sepia(97%) saturate(7488%) hue-rotate(245deg) brightness(100%) contrast(104%)",
      "#000080": "invert(10%) sepia(98%) saturate(2000%) hue-rotate(240deg) brightness(50%) contrast(110%)",
      // Yellow
      "#ffff00": "invert(83%) sepia(96%) saturate(748%) hue-rotate(1deg) brightness(111%) contrast(101%)",
      // Magenta
      "#ff00ff": "invert(33%) sepia(95%) saturate(6366%) hue-rotate(293deg) brightness(100%) contrast(109%)",
      // Orange
      "#ffa500": "invert(64%) sepia(83%) saturate(2100%) hue-rotate(360deg) brightness(104%) contrast(101%)",
      // Pink
      "#ffc0cb": "invert(92%) sepia(17%) saturate(507%) hue-rotate(292deg) brightness(101%) contrast(101%)",
      // Gray shades
      "#808080": "invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
      "#c0c0c0": "invert(83%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"
    };
  }

  // Normalize hex color (handle 3-digit hex, 8-digit hex with alpha, remove #, etc.)
  normalizeHex(hex) {
    hex = hex.replace('#', '').toLowerCase();
    
    // Handle 8-digit hex (AARRGGBB format - alpha first)
    if (hex.length === 8) {
      // Extract alpha and RGB parts
      const alpha = hex.substring(0, 2);
      const rgb = hex.substring(2, 8);
      
      // Return object with both RGB and alpha information
      return {
        hex: '#' + rgb,
        alpha: parseInt(alpha, 16) / 255,
        originalFormat: 'alpha-first'
      };
    }
    
    // Handle 8-digit hex (RRGGBBAA format - alpha last) 
    if (hex.length === 8 && hex.match(/^[0-9a-f]{8}$/)) {
      // Check if this might be RRGGBBAA format by looking at common patterns
      const rgb = hex.substring(0, 6);
      const alpha = hex.substring(6, 8);
      
      return {
        hex: '#' + rgb,
        alpha: parseInt(alpha, 16) / 255,
        originalFormat: 'alpha-last'
      };
    }
    
    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // Standard 6-digit hex
    if (hex.length === 6) {
      return {
        hex: '#' + hex,
        alpha: 1,
        originalFormat: 'standard'
      };
    }
    
    // Fallback for invalid formats
    return {
      hex: '#000000',
      alpha: 1,
      originalFormat: 'fallback'
    };
  }

  // Convert hex to RGB (supports alpha channel)
  hexToRgb(hex) {
    const normalized = this.normalizeHex(hex);
    const hexColor = normalized.hex;
    const alpha = normalized.alpha;
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: alpha,
      originalFormat: normalized.originalFormat
    } : null;
  }

  // Convert RGB to HSL
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  // Calculate brightness from RGB
  getBrightness(r, g, b) {
    return Math.round((r * 299 + g * 587 + b * 114) / 1000);
  }

  // Dynamic filter generation using color analysis
  generateDynamicFilter(hex) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return "invert(0%)";

    const { r, g, b } = rgb;
    const hsl = this.rgbToHsl(r, g, b);
    const brightness = this.getBrightness(r, g, b);

    // Calculate filter values based on color properties
    let invert, sepia, saturate, hueRotate, brightnessFilter, contrast;

    // Invert calculation based on brightness
    if (brightness > 128) {
      invert = Math.round((brightness - 128) / 127 * 100);
    } else {
      invert = Math.round((128 - brightness) / 128 * 20);
    }

    // Sepia based on color temperature
    const isWarm = hsl.h >= 30 && hsl.h <= 90;
    const isCool = hsl.h >= 180 && hsl.h <= 270;
    
    if (isWarm) {
      sepia = Math.min(95, hsl.s);
    } else if (isCool) {
      sepia = Math.max(10, Math.min(50, hsl.s / 2));
    } else {
      sepia = Math.min(90, hsl.s);
    }

    // Saturate based on original saturation
    saturate = Math.max(100, Math.min(7500, hsl.s * 50));

    // Hue rotate - adjust based on target hue
    hueRotate = hsl.h;

    // Brightness adjustment
    brightnessFilter = Math.max(50, Math.min(150, 100 + (brightness - 128) / 5));

    // Contrast adjustment
    contrast = Math.max(80, Math.min(130, 100 + hsl.s / 5));

    return `invert(${invert}%) sepia(${sepia}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg) brightness(${brightnessFilter}%) contrast(${contrast}%)`;
  }

  // Advanced algorithm using iterative approximation (more accurate but slower)
  generateAdvancedFilter(hex, maxIterations = 20) {
    const target = this.hexToRgb(hex);
    if (!target) return "invert(0%)";

    // Start with base values
    let bestFilter = { invert: 0, sepia: 0, saturate: 100, hueRotate: 0, brightness: 100, contrast: 100 };
    let bestLoss = Infinity;

    // Simple genetic algorithm approach
    for (let i = 0; i < maxIterations; i++) {
      const filter = this.mutateFilter(bestFilter, i === 0);
      const loss = this.calculateLoss(target, filter);
      
      if (loss < bestLoss) {
        bestLoss = loss;
        bestFilter = { ...filter };
      }
    }

    return this.filterToString(bestFilter);
  }

  // Mutate filter values for optimization
  mutateFilter(filter, isFirst) {
    if (isFirst) {
      // Initial guess based on color properties
      const rgb = this.hexToRgb('#000000'); // Will be replaced by actual calculation
      return {
        invert: Math.random() * 100,
        sepia: Math.random() * 100,
        saturate: 100 + Math.random() * 3000,
        hueRotate: Math.random() * 360,
        brightness: 50 + Math.random() * 100,
        contrast: 50 + Math.random() * 100
      };
    }

    // Small mutations
    return {
      invert: Math.max(0, Math.min(100, filter.invert + (Math.random() - 0.5) * 10)),
      sepia: Math.max(0, Math.min(100, filter.sepia + (Math.random() - 0.5) * 10)),
      saturate: Math.max(0, Math.min(5000, filter.saturate + (Math.random() - 0.5) * 200)),
      hueRotate: (filter.hueRotate + (Math.random() - 0.5) * 30) % 360,
      brightness: Math.max(0, Math.min(200, filter.brightness + (Math.random() - 0.5) * 10)),
      contrast: Math.max(0, Math.min(200, filter.contrast + (Math.random() - 0.5) * 10))
    };
  }

  // Calculate how close the filter gets to target color (simplified)
  calculateLoss(target, filter) {
    // This is a simplified loss function
    // In practice, you'd apply the filter to a test element and measure the difference
    const expected = this.applyFilterToColor({ r: 0, g: 0, b: 0 }, filter);
    const deltaR = target.r - expected.r;
    const deltaG = target.g - expected.g;
    const deltaB = target.b - expected.b;
    
    return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
  }

  // Simulate filter application (simplified approximation)
  applyFilterToColor(rgb, filter) {
    let { r, g, b } = rgb;

    // Apply invert
    if (filter.invert > 0) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    // Apply sepia (simplified)
    if (filter.sepia > 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = Math.min(255, gray + filter.sepia);
      g = Math.min(255, gray + filter.sepia * 0.8);
      b = Math.min(255, gray + filter.sepia * 0.4);
    }

    // Apply brightness
    const brightnessFactor = filter.brightness / 100;
    r = Math.min(255, r * brightnessFactor);
    g = Math.min(255, g * brightnessFactor);
    b = Math.min(255, b * brightnessFactor);

    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  }

  // Convert filter object to CSS string
  filterToString(filter) {
    return `invert(${Math.round(filter.invert)}%) sepia(${Math.round(filter.sepia)}%) saturate(${Math.round(filter.saturate)}%) hue-rotate(${Math.round(filter.hueRotate)}deg) brightness(${Math.round(filter.brightness)}%) contrast(${Math.round(filter.contrast)}%)`;
  }

  // Main method to get filter - tries predefined first, then dynamic
  getFilter(hex, useAdvanced = false) {
    const normalized = this.normalizeHex(hex);
    const hexColor = normalized.hex;
    const alpha = normalized.alpha;
    
    // Check predefined filters first (using RGB part only)
    if (this.predefinedFilters[hexColor]) {
      const baseFilter = this.predefinedFilters[hexColor];
      
      // If alpha is less than 1, we might want to adjust the filter
      if (alpha < 1) {
        // For semi-transparent colors, we can adjust brightness/contrast
        const opacity = Math.round(alpha * 100);
        return `${baseFilter} opacity(${opacity}%)`;
      }
      
      return baseFilter;
    }

    // Use dynamic generation
    let filter;
    if (useAdvanced) {
      filter = this.generateAdvancedFilter(hexColor);
    } else {
      filter = this.generateDynamicFilter(hexColor);
    }
    
    // Apply alpha if present
    if (alpha < 1) {
      const opacity = Math.round(alpha * 100);
      filter += ` opacity(${opacity}%)`;
    }
    
    return filter;
  }

  // Utility method to parse your specific format (#4976F4FF)
  parseAlphaFirstHex(hex) {
    // Remove # if present
    const cleanHex = hex.replace('#', '');
    
    if (cleanHex.length === 8) {
      const alpha = cleanHex.substring(0, 2);
      const rgb = cleanHex.substring(2, 8);
      
      return {
        alpha: parseInt(alpha, 16) / 255,
        rgb: '#' + rgb,
        r: parseInt(rgb.substring(0, 2), 16),
        g: parseInt(rgb.substring(2, 4), 16),
        b: parseInt(rgb.substring(4, 6), 16)
      };
    }
    
    return null;
  }

  // Method specifically for your format
  getFilterForAlphaFirstFormat(hex) {
    const parsed = this.parseAlphaFirstHex(hex);
    if (!parsed) return "invert(0%)";
    
    // Get filter for the RGB part
    const rgbFilter = this.getFilter(parsed.rgb, false);
    
    // Apply alpha
    if (parsed.alpha < 1) {
      const opacity = Math.round(parsed.alpha * 100);
      return `${rgbFilter} opacity(${opacity}%)`;
    }
    
    return rgbFilter;
  }
}

export const extractFontFamily = (classString = "") => {
  const match = classString.match(/font-\[['"]?([^'"\]]+)['"]?\]/);
  return match ? match[1] : null;
};





export const resolveUpdatedFormValues = (obj, updatedFormInputData) => {
  if (Array.isArray(obj)) {
    return obj.map(v => resolveUpdatedFormValues(v, updatedFormInputData));
  }

  if (obj && typeof obj === "object") {
    const res = {};
    for (const k in obj) {
      res[k] = resolveUpdatedFormValues(obj[k], updatedFormInputData);
    }
    return res;
  }

  if (typeof obj === "string" && obj.startsWith("updatedFormInputData?.")) {
    const key = obj.split("?.")[1];
    return updatedFormInputData?.[key];
  }

  return obj;
};
