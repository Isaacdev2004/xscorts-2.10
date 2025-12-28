import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { COUNTRIES, states_cities, countries_states } from '../constants';

@Injectable()
export class CountryService {
  constructor(private httpService: HttpService) {}

  private countryList;

  public getList() {
    if (this.countryList) {
      return this.countryList;
    }

    this.countryList = COUNTRIES.map((c) => ({
      name: c.name,
      code: c.code,
      flag: c.flag
    }));
    return this.countryList;
  }

  getStates(country: string) {
    return countries_states.find(item => item.name === country);
  }

  getCities(state: string) {
    return states_cities.find(item => item.name === state);
  }

  public async findCountryByIP(ip: string): Promise<AxiosResponse<any>> {
    try {
      const response = await this.httpService
        .get(`http://ip-api.com/json/${ip}`)
        .toPromise();
      return response.data;
    } catch (e) {
      // const error = e.then(resp => resp);;
      return null;
    }
  }
}
