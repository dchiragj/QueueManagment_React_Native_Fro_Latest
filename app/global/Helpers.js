import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { ToastAndroid, Platform } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

/**
 * @desc Checks for valid email
 * @param {*} value // Accepts string
 */
export function isEmail(value) {
  var myRegEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var isValid = myRegEx.test(value);
  return isValid ? true : false;
}

/**
 * @desc Checks for Empty string
 * @param {*} value // Accepts string, object
 */
export function isEmpty(value) {
  if (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * @desc: Check valid date
 */
export function isValidDate(d) {
  return d instanceof Date;
}

export function getDate(date) {
  if (!date) date = new Date();
  else date = new Date(date);

  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/**
 * @desc Change Display Format based on date
 * @param {*} date
 */
export function __displayDate(date) {
  if (!date) return date;

  const today = getDate();
  const yesterday = getDate();
  yesterday.setDate(yesterday.getDate() - 1);

  let diff = moment(today).diff(date, 'days');

  if (diff == 0) {
    return 'Today';
  } else if (diff == 1) {
    return `Yesterday`;
  } else {
    return moment(date).format('dddd, MMM Do');
  }
}

export function formatCurrency(num) {
  try {
    if (num) return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  } catch (e) {}
  return num;
}
export function mathRound(number, digit = 2) {
  try {
    if (Number(number) < 1) digit = 3;
    if (number) return Number(number).toFixed(digit);
  } catch (e) {}
  return Number(0).toFixed(2);
}

export function currencyWithDecimal(num) {
  let returnValue = num;
  try {
    let digit = 2;
    if (num) {
      if (Number(num) < 1) digit = 3;
      if (Number(num) > 999) digit = 1;
      const num2 = Number(num).toFixed(digit);
      returnValue = formatCurrency(num2);
    } else {
      returnValue = Number(0).toFixed(digit);
    }
  } catch (e) {}
  return returnValue;
}

export function toTitleCase(str) {
  if (!str) return str;

  str = str.trim();
  if (str.length == 0) return str;

  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function toSentenseCase(str) {
  if (!str) return str;

  str = str.trim();
  if (str.length == 0) return str;

  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
}

export const getAPIResponseError = (e) => {
  if (e) {
    if (e.response && e.response.data) {
      if (e.response.data.message) {
        return e.response.data.message;
      }
    }
  }
  return;
};

export function toastNotification(message, isShowInIOS = true) {
  if (Platform.OS == 'ios') {
    if (isShowInIOS) alert(message);
  } else {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

//Get file Name
export const getFileName = (path) => {
  let split = path.split('/');
  if (split && split.length > 0) {
    return split[split.length - 1];
  }
  return;
};

export const miliSecondsToHMmSs = (miliseconds = 0) => {
  const ms = (miliseconds % 1000) / 10;
  const s = (miliseconds % (1000 * 60)) / 1000;
  const m = (miliseconds % (1000 * 60 * 60)) / (1000 * 60);
  const h = (miliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
  return {
    h: String(Math.floor(h)).padStart(2, '0'),
    m: String(Math.floor(m)).padStart(2, '0'),
    s: String(Math.floor(s)).padStart(2, '0'),
    ms: String(Math.floor(ms)).padStart(2, '0')
  };
};

export const durationInAsMilliseconds = (start, end) => {
  start = moment(start);
  end = moment(end);
  const duration = moment.duration(end.diff(start));
  return duration.asMilliseconds();
};

export const durationInAsSeconds = (start, end) => {
  start = moment(start);
  end = moment(end);
  const duration = moment.duration(end.diff(start));
  return duration.asSeconds();
};

export const getFirstChar = (str) => {
  if (!str) return str;
  return str.charAt(0);
};

export const isDay = () => {
  var today = new Date();
  var curHr = today.getHours();

  if (5 <= curHr < 19) return true;
  return false;
};

export const secondsToMmSs = (seconds = 0) => {
  seconds = Number(seconds);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor((seconds % 3600) % 60);
  return {
    m: String(m),
    s: String(s).padStart(2, '0')
  };
};

export const getDisplayName = (firstname, lastname) => {
  return firstname + ' ' + lastname;
};

export const stackReset = (navigation, routeName) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName }],
    })
  );
};