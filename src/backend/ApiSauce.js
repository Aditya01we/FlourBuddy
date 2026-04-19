import {create} from 'apisauce';
import {ApiSauceJson, ApiSauceMultipart, ApiSauceJson1} from './Config';
const ApiSauce = create(ApiSauceJson);
const ApiSauceMultiPart = create(ApiSauceMultipart);
export const ApiSauceMu = create(ApiSauceMultipart);
export const ApiSauce1 = create(ApiSauceJson1);
export const _SetAuthToken = token => {
  ApiSauce.setHeader('Authorization', `Bearer ${token}`);
  ApiSauceMultiPart.setHeader('Authorization', `Bearer ${token}`);
};
export const _RemoveAuthToken = () => {
  ApiSauce.deleteHeader('Authorization');
  ApiSauceMultiPart.deleteHeader('Authorization');
};
export default ApiSauce;
