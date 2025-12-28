import { ICountry } from '@interfaces/utils';

/**
 * Prioritize Netherlands (NL) and Belgium (BE) in country lists
 * This matches kinky.nl functionality where NL and BE are primary markets
 */
export function prioritizeCountries(countries: ICountry[]): ICountry[] {
  if (!countries || !Array.isArray(countries)) {
    return countries;
  }

  // Find NL and BE
  const nl = countries.find(c => c.code === 'NL');
  const be = countries.find(c => c.code === 'BE');
  
  // Remove them from the original array
  const otherCountries = countries.filter(c => c.code !== 'NL' && c.code !== 'BE');
  
  // Return prioritized list: NL, BE, then all others
  const prioritized: ICountry[] = [];
  if (nl) prioritized.push(nl);
  if (be) prioritized.push(be);
  prioritized.push(...otherCountries);
  
  return prioritized;
}

/**
 * Get default country (Netherlands for kinky.nl)
 */
export function getDefaultCountry(): string {
  return 'Netherlands';
}

