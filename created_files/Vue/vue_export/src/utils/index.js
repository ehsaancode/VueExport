import {
  sessionId,
  userSessionId,
  userSessionCCId,
  cartConfigSession,
  configSession,
  ssipSession,
  dineConfigSession,
  recentStores,
  recentLocations,
  recentLocation,
  recentAddressId,
  dismissPendingOrders,
  versioncontrol,
} from "../config";
import axios from "axios";

// Set headers from localstorage
export const getAxiosWithHeaders = () => {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  axios.defaults.headers = {
    Ssip: getSSIPSession() || "",
    Cartconfig: JSON.stringify(getCartConfigSession()) || "",
    Appname: import.meta.env.VITE_APP_NAME,
    Usrid: getUserSessionId() || "",
  };
  return axios;
};

export const setStorageJSON = (key, object) =>
  localStorage.setItem(key, JSON.stringify(object));
export const setStorageString = (key, string) =>
  localStorage.setItem(key, string);

export const setCookiesAlert = (key, value) => localStorage.setItem(key, value);
export const getCookiesAlert = (key) => localStorage.getItem(key);

// Get and parse data from storage
export const getStorageJSON = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item !== null && item !== undefined) {
      const data = JSON.parse(item);
      if (Object.keys(data)) {
        return data;
      } else return null;
    }
    return null;
  } catch (error) {
    console.error(
      `Error parsing JSON from localStorage for key ${key}:`,
      error
    );
    return null;
  }
};

// Get string from storage
export const getStorageString = (key) => {
  if (localStorage.getItem(key)) {
    return localStorage.getItem(key);
  } else {
    return null;
  }
};

export const removeStorage = (key) => localStorage.removeItem(key);

// export const removeAllSpaceFromString = (str) => str?.replace(/ +/g, "");
export const removeAllSpaceFromString = (str) => {
  return typeof str === "string" ? str.replace(/ +/g, "") : str;
};

export const postcodeRegEx =
  /^(GIR[ ]?0AA|((AB|AL|B|BA|BB|BD|BH|BL|BN|BR|BS|BT|CA|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DD|DE|DG|DH|DL|DN|DT|DY|E|EC|EH|EN|EX|FK|FY|G|GL|GY|GU|HA|HD|HG|HP|HR|HS|HU|HX|IG|IM|IP|IV|JE|KA|KT|KW|KY|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|ML|N|NE|NG|NN|NP|NR|NW|OL|OX|PA|PE|PH|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TD|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO|ZE)(\d[\dA-Z]?[ ]?\d[ABD-HJLN-UW-Z]{2}))|BFPO[ ]?\d{1,4})$/i;
export const emailRegEx = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

export const telephoneRegEx = /^[0-9]{10,11}$/;

export const addSpaceBetweenForMobileNo = (str) =>
  str.replace(/(\d{5})(\d{5})/, "$1 $2");

export const isNumeric = (value) => /^-?\d+$/.test(value);

export const normalizeInputMobile = (value, previousValue) => {
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;
  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return currentValue;
    if (cvLength < 6)
      return `${currentValue.slice(0, 5)} ${currentValue.slice(5)}`;
    return `${currentValue.slice(0, 5)} ${currentValue.slice(5)}`;
  }
};

export const setSession = (data) => setStorageJSON(sessionId, data);



export const setSessionUserId = (data) => setStorageString(userSessionId, data);
export const getUserSessionId = () => getStorageString(userSessionId);


export const setSessionCCId = (data) => setStorageString(userSessionCCId, data);

export const setDineConfigSession = (data) =>
  setStorageJSON(dineConfigSession, data);

export const setCartConfigSession = (data) =>
  setStorageJSON(cartConfigSession, data);

export const setConfigSession = (data) => setStorageJSON(configSession, data);

export const setSsipSession = (data) => setStorageString(ssipSession, data);

export const setLocationSessions = (data) =>
  setStorageJSON(recentLocations, data);

export const setStoresSessions = (data) => setStorageJSON(recentStores, data);

export const setLocationsSessions = (data) =>
  setStorageJSON(recentLocation, data);

export const setRecentAddressId = (data = "") =>
  setStorageString(recentAddressId, data);

export const setVersionControl = (data) => setStorageJSON(versioncontrol,data);

export const setDismissedPendingOrders = (value) =>
  setStorageJSON(dismissPendingOrders, value);

export const getLocationSessions = () => getStorageString(recentLocations);

export const getStoresSessions = () => getStorageJSON(recentStores);

export const getSession = () => getStorageJSON(sessionId);


export const getCartConfigSession = () => getStorageJSON(cartConfigSession);

export const getConfigSession = () => getStorageJSON(configSession);

export const getSSIPSession = () => getStorageString(ssipSession);

export const getDineConfigSession = () => getStorageJSON(dineConfigSession);

export const getLocationsSession = () => getStorageJSON(recentLocations);

export const getLocationsSessions = () => getStorageJSON(recentLocation);

export const getRecentAddressId = () => getStorageString(recentAddressId);

export const getVersionControl = () => getStorageJSON(versioncontrol);

export const getDismissedPendingOrders = () =>
  getStorageJSON(dismissPendingOrders);

export const removeSession = () => {
  removeStorage(sessionId);
  removeStorage(userSessionId);
};

export const removessipSession = () => {
  removeStorage(ssipSession);
};

export const removeDismissedPendingOrders = () => {
  removeStorage(dismissPendingOrders);
};

export const updateUserSessionId = () => {};

export const capitalizeFirstWord = (str) =>
  str?.charAt(0)?.toUpperCase() + str?.slice(1);

export const getTimeRemaining = (e) => {
  const total = Date.parse(e) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / 1000 / 60 / 60) % 24);
  return {
    total,
    hours,
    minutes,
    seconds,
  };
};

export const ProperNameRegEx = /^[a-zA-Z\s]*$/;
export const mobileNumberRegEx = /^[0-9]{10,11}$/;
export const emailIdrRegEx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const cardNumberRegex = /^\d{4} \d{4} \d{4} \d{4}$/;
export const securityCodeRegex = /^\d{3,4}$/;
export const dateRegex = /^(0[1-9]|1[012])\d{2}$/;
export const cardHolderNameRegex = /^[A-Za-z ]{2,50}$/;
export const CVVRegex = /^\d{3,4}$/;

export const formatTotal = function (num) {
  return number_format(Math.round(num * 100) / 100, 2, ".", "");
};

export const number_format = function (
  number,
  decimals,
  dec_point,
  thousands_sep
) {
  number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
  let n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep == "undefined" ? "," : thousands_sep,
    dec = typeof dec_point == "undefined" ? "." : dec_point,
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

/*.................................*/
export const facebookPageLink = "https://www.facebook.com/kuickuk";
export const twitterPageLink = "https://twitter.com/kuickuk";
export const instagramPageLink = "https://www.instagram.com/kuickuk";

export const downloadAppStoreUrl =
  "https://apps.apple.com/in/app/kuick/id1593404273";
export const downloadGooglePlayStoreUrl =
  "https://play.google.com/store/apps/details?id=com.redoq.kuick";

export const addressInfo = "Kolkata, 700001";
export const phoneNumberInfo = "+44 116 471 0368";

export const chatWithAndWhatApp =
  "https://api.whatsapp.com/send/?phone=447502920886&text&type=phone_number&app_absent=0";

export const chatWithAndGmail =
  "https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=support@Kuick.com";

export const sliderSettingsLeft = {
  dots: false,
  infinite: true,
  speed: 3500,
  slidesToShow: 1,
  slidesToScroll: 1,
  vertical: true, // Enable vertical mode
  verticalSwiping: false, // Enable vertical swiping
  autoplay: true,
  autoplaySpeed: 5500,
  pauseOnHover: true,
  arrows: false,
  rtl: true,
};

export const sliderSettingsRight = {
  dots: false,
  infinite: true,
  speed: 3500,
  slidesToShow: 1,
  slidesToScroll: 1,
  vertical: true, // Enable vertical mode
  verticalSwiping: false, // Enable vertical swiping
  autoplay: true,
  autoplaySpeed: 5500,
  pauseOnHover: true,
  arrows: false,
  rtl: false,
};
