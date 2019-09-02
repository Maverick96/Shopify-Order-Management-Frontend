import { environment } from '../../../environments/environment';
const BASE_URL = environment.apiUrl;
const MOBILE_REGEX = /^(\+91)?[7-9][0-9]{9}$/;
export { BASE_URL, MOBILE_REGEX };