import { ICountry, ILanguage, IPhoneCodes } from 'src/interfaces';
import { APIRequest, IResponse } from './api-request';

export class UtilsService extends APIRequest {
  private _countries = [] as any;

  async countriesList(): Promise<IResponse<ICountry>> {
    if (this._countries.length) {
      return this._countries;
    }
    const resp = await this.get('/countries/list');
    this._countries = resp;
    return resp;
  }

  languagesList(): Promise<IResponse<ILanguage>> {
    return this.get('/languages/list');
  }

  phoneCodesList(): Promise<IResponse<IPhoneCodes>> {
    return this.get('/phone-codes/list');
  }

  heightList(): Promise<IResponse<string>> {
    return this.get('/user-additional/heights');
  }

  weightList(): Promise<IResponse<string>> {
    return this.get('/user-additional/weights');
  }

  allAttributes(): Promise<any> {
    return this.get('/attributes/list/all');
  }

  verifyRecaptcha(token: string) {
    return this.post('/re-captcha/verify', { token });
  }

  countriesListfil(): Promise<IResponse<ICountry>> {
    return this.get('/countries/list');
  }

  statesProvincesList(country:string): Promise<IResponse<any>> {
    return this.get(`/countries/state/list?name=${country}`);
  }

  cityList(state:string): Promise<IResponse<any>> {
    return this.get(`/countries/city/list?name=${state}`);
  }
}

export const utilsService = new UtilsService();
