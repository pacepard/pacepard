/**
 * Country data and helpers for flags and country codes.
 * Uses packages/blocs/src/_data/countries.json.
 */

import countriesData from './countries.json';

/** Minimal country shape for selector and dropdowns (name, code2, code3, phoneCode, flag) */
export interface Country {
    name: string;
    code2: string;
    code3: string;
    capital?: string;
    region?: string;
    subregion?: string;
    slug?: string;
    /** Phone dial code e.g. "+1" or "+234" */
    phoneCode?: string;
    /** Flag image URL or base64 */
    flag?: string;
    base64?: string;
    currencyCode?: string;
    currencyImage?: string;
    states?: unknown[];
    timezones?: unknown[];
}

/** Raw entry from JSON; some fields optional depending on source */
type CountryRaw = Record<string, unknown> & {
    name: string;
    code2: string;
    code3: string;
    phoneCode?: string;
    flag?: string;
    base64?: string;
    currencyCode?: string;
    currencyImage?: string;
    capital?: string;
    region?: string;
    subregion?: string;
    slug?: string;
    states?: unknown[];
    timezones?: unknown[];
};

const raw = countriesData as CountryRaw[];

function toCountry(c: CountryRaw): Country {
    return {
        name: c.name,
        code2: c.code2,
        code3: c.code3,
        capital: c.capital,
        region: c.region,
        subregion: c.subregion,
        slug: c.slug,
        phoneCode: c.phoneCode,
        flag: c.flag,
        base64: c.base64,
        currencyCode: c.currencyCode,
        currencyImage: c.currencyImage,
        states: c.states,
        timezones: c.timezones,
    };
}

let cached: Country[] | null = null;

/**
 * Load and return all countries from blocs _data, sorted by name.
 */
export function readCountries(): Country[] {
    if (cached) return cached;
    const list = raw
        .map(toCountry)
        .sort((a, b) => a.name.localeCompare(b.name));
    cached = list;
    return list;
}

/**
 * Get one country by ISO 3166-1 alpha-2 code (e.g. "NG", "US").
 */
export function getCountry(code2: string): Country | null {
    const code = code2?.toUpperCase?.();
    if (!code) return null;
    const countries = readCountries();
    return countries.find((c) => c.code2 === code) ?? null;
}

/**
 * List suitable for dropdowns: code (code2), name, and normalized phone.
 * Filters out entries with no phoneCode; phone is normalized (e.g. "+234").
 */
export function listCountries(): {
    code: string;
    name: string;
    phone: string;
}[] {
    const countries = readCountries();
    return countries
        .map((c) => {
            let phone = c.phoneCode ?? '';
            if (phone && phone.includes('-')) {
                phone = '+' + phone.substring(3);
            }
            return { code: c.code2, name: c.name, phone };
        })
        .filter((x) => x.phone !== '');
}
