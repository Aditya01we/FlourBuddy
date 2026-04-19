import store from './store';
export const Login = user =>
  store.dispatch({type: 'login', paylod: user ? user : {}});
export const Token = user =>
  store.dispatch({type: 'token', paylod: user ? user : ''});
export const Location = user =>
  store.dispatch({type: 'location', paylod: user ? user : {}});
export const Male = user =>
  store.dispatch({type: 'male', paylod: user ? user : {}});
export const Female = user =>
  store.dispatch({type: 'female', paylod: user ? user : {}});
export const Firebase = user =>
  store.dispatch({type: 'ftoken', paylod: user ? user : ''});
export const Logout = user =>
  store.dispatch({type: 'logout', paylod: user ? user : ''});
export const Live = user =>
  store.dispatch({type: 'live', paylod: user ? user : ''});
export const SetNetInfo = user =>
  store.dispatch({type: 'netinfo', paylod: user ? user : ''});
// export const Language = user =>
//   store.dispatch({type: 'language', paylod: user ? user : ''});
export const Language = payload => ({type: 'language', payload});
