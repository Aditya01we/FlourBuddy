import AsyncStorage from '@react-native-async-storage/async-storage';
import {PATH_URL} from './Config';
import ApiSauceMu from './ApiSauce';
import ApiSauce from './ApiSauce';
import {ApiSauce1} from './ApiSauce';
import store from '../redux/store';
import {Dimensions} from 'react-native';

import {latitudeDelta} from '../backend/Config';
const request = (path, json) => {
  return new Promise((resolve, reject) => {
    ApiSauce.post(path, json).then(response => {
      //alert(JSON.stringify(json))
      if (response.ok) {
        resolve(response.data);
      } else {
        //   alert(JSON.stringify(response));
        console.log(response.err);
        reject(response.err);
      }
    });
  });
};
const request1 = (path, json) => {
  return new Promise((resolve, reject) => {
    ApiSauce1.post(path, json).then(response => {
      //alert(JSON.stringify(json))
      if (response.ok) {
        resolve(response.data);
      } else {
        //   alert(JSON.stringify(response));
        console.log(response.err);
        reject(response.err);
      }
    });
  });
};
const requestMultipart = (path, formdata) => {
  return new Promise((resolve, reject) => {
    ApiSauce.setHeader('Authorization', `Bearer ${store.getState().token}`);
    ApiSauce.setHeader('Accept', 'application/json');
    ApiSauceMu.post(path, formdata).then(response => {
      if (response.ok) {
        resolve(response.data);
      } else {
        alert(JSON.stringify(response));
        reject(response.err);
      }
    });
  });
};

const requesth = (path, json) => {
  console.log('Token', store.getState().token);
  var headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  return new Promise((resolve, reject) => {
    ApiSauce.setHeader('Authorization', `Bearer ${store.getState().token}`);
    ApiSauce.post(path, json).then(response => {
      //  alert(JSON.stringify(path))
      console.log(JSON.stringify(response));
      if (response.ok) {
        resolve(response.data);
      } else {
        //  alert(JSON.stringify(response))
        console.log(response.err);
        reject(response.err);
      }
    });
  });
};
export const requestGet = (path, json) => {
  console.log('Token', store.getState().token);
  return new Promise((resolve, reject) => {
    ApiSauce.get(path, json).then(response => {
      if (response.ok) {
        resolve(response.data);
      } else {
        console.log(JSON.stringify(response, null, 2));
        resolve({status: false, data: response.data, error: response?.problem});
      }
    });
  });
};

export const requestGet1 = (path, json) => {
  return new Promise((resolve, reject) => {
    ApiSauce.setHeader('Authorization', `Bearer ${store.getState().token}`);
    ApiSauce.get(path, json).then(response => {
      if (response.ok) {
        resolve(response.data);
      } else {
        console.log(JSON.stringify(response, null, 2));
        resolve({status: false, data: response.data, error: response?.problem});
      }
    });
  });
};

export const UserHome = json => requesth(PATH_URL.userhome, json);
export const Verifyotp = json => request(PATH_URL.verifyotp, json);
export const CLogin = json => request(PATH_URL.login, json);
export const LoginVerifyOtp = json => request(PATH_URL.verifyotp, json);
export const GetProfile = json => request(PATH_URL.details, json);

export const GetPropertySearch = json =>
  request1(PATH_URL.propertie_search, json);

export const GetState = json => requestGet(PATH_URL.getState, json);
export const GetCity = json => request1(PATH_URL.getcity, json);
export const GetCurrency = json => request1(PATH_URL.getcurrency, json);
export const GetTime = json => request1(PATH_URL.gettime, json);
export const GetProperty = json => request1(PATH_URL.getproperty, json);
export const GetBuilding = json => request1(PATH_URL.getbuilding, json);
export const GetBhk = json => request1(PATH_URL.getbhk, json);
export const GetFacing = json => request1(PATH_URL.getfacing, json);
export const GetAge = json => request1(PATH_URL.getage, json);
export const GetFloor = json => request1(PATH_URL.getfloor, json);
export const GetApartment = json => request1(PATH_URL.getapartment, json);
export const GetMonth = json => request1(PATH_URL.getmonth, json);
export const GetFrom = json => request1(PATH_URL.getfrom, json);
export const GetFurnishing = json => request1(PATH_URL.getfurnishing, json);
export const HomeProperies = json => request1(PATH_URL.homeproperties, json);
export const GetCheck = json => request1(PATH_URL.getcheck, json);
export const GetContractorCategory = json =>
  requestGet(PATH_URL.contractorcategory, json);
export const GetBankList = json => requestGet(PATH_URL.getbanklist, json);
export const CancelMessage = json =>
  request(PATH_URL.order_cancel_reqest, json);
export const OrderCancelRequest = json =>
  request(PATH_URL.order_cancel_reqest1, json);
export const AssignContactor = json =>
  request(PATH_URL.assign_contractor, json);

export const CancelOrder = json => request(PATH_URL.cancelorder, json);

export const AsyncStorageSetUser = user =>
  AsyncStorage.setItem('user', JSON.stringify(user));
export const AsyncStorageSettoken = user => AsyncStorage.setItem('token', user);
export const AsyncStorageSetFcmToken = fcmToken =>
  AsyncStorage.setItem('fcmToken', fcmToken);

export const AsyncStorageGetUser = () => AsyncStorage.getItem('user');
export const AsyncStorageGetFcmToken = () => AsyncStorage.getItem('fcmToken');
export const AsyncStorageGettoken = user => AsyncStorage.getItem('token');
export const AsyncStorageClear = () => AsyncStorage.clear();

export const AsyncStorageSetlanguage = user =>
  AsyncStorage.setItem('language', user);
export const AsyncStorageGetlanguage = user => AsyncStorage.getItem('language');
export const AspectRatio = () =>
  Dimensions.get('window').width / Dimensions.get('window').height;
export const Height = Dimensions.get('window').height;
export const Width = Dimensions.get('window').width;

const LocalStorage = {
  setToken: token => AsyncStorage.setItem('authToken', token),
  getToken: () => AsyncStorage.getItem('authToken'),
  setUserDetail: user_Detail =>
    AsyncStorage.setItem('user_Detail', user_Detail),
  getUserDetail: () => AsyncStorage.getItem('user_Detail'),
  setFcmToken: fcmToken => AsyncStorage.setItem('fcmToken', fcmToken),
  getFcmToken: () => AsyncStorage.getItem('fcmToken'),
  getFCM: token => AsyncStorage.setItem('authToken', token),
  getFCM: () => AsyncStorage.getItem('authToken'),
  setFirstTimeOpen: () => AsyncStorage.setItem('firstTimeOpen', 'false'),
  getFirstTimeOpen: () => AsyncStorage.getItem('firstTimeOpen'),
  setPresentState: value => AsyncStorage.setItem('value', value),
  getPresentState: () => AsyncStorage.getItem('value'),
  setAbsentState: value => AsyncStorage.setItem('value', value),
  getAbsentState: () => AsyncStorage.getItem('value'),

  setUserId: id => AsyncStorage.setItem('id', JSON.stringify(id)),
  getUserId: () => AsyncStorage.getItem('id'),
  setDescription: description =>
    AsyncStorage.setItem('description', description),
  getDescription: () => AsyncStorage.getItem('description'),
  setSearch: search => AsyncStorage.setItem('search', search),
  getSearch: () => AsyncStorage.getItem('search'),

  clear: AsyncStorage.clear,
};

const LocalStorageLanguage = {
  setLanguage: language => AsyncStorage.setItem('language', language),
  getLanguage: () => AsyncStorage.getItem('language'),
};

export {LocalStorage,LocalStorageLanguage};

export const formatAmount = amount =>
  `\u20B9 ${parseInt(amount)
    .toFixed(0)
    .replace(/(\d)(?=(\d\d)+\d$)/g, '$1,')}`;

export const formatNumber = str => str.replace(/,/g, '').replace('\u20B9 ', '');

export const textInPrice = price => `\u20B9 ${price}`;
