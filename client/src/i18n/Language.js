import * as EN from './en';
import * as d3 from 'd3';

let fallbackTerms = EN.terms;

/**
 * Get the units, translation and format functions for the specified language
 * @return {Object}          Language units, translation and format functions
 */
export function getLanguage() {
	let lang;
	let translate;

	lang = EN;

	let currentTerms = lang.terms;
	let d3Locale = d3.formatLocale(lang.formats);
	let gen = d3Locale.format('');
	const round = function (x, n) {
		const ten_n = Math.pow(10, n);
		return Math.round(x * ten_n) / ten_n;
	};

	if (lang === EN) {
		translate = (t, x) => {
			return currentTerms[t + '_' + x] || currentTerms[t] || t;
		};
	} else {
		translate = (t, x) => {
			return currentTerms[t + '_' + x] || currentTerms[t] || fallbackTerms[t + '_' + x] || fallbackTerms[t] || t;
		};
	}

	return {
		formats: {
			gen, // General number format (.e.g 1,001,001.1234)
			int: d3Locale.format(',.0f'), // Fixed to 0 decimal places (.e.g 1,001)
			f1: d3Locale.format(',.1f'), // Fixed to 1 decimal place (.e.g 1,001.1)
			f2: d3Locale.format(',.2f'), // Fixed to 2 decimal places (.e.g 1,001.10)
			s2: d3Locale.format('.2s'), // SI Format to 2 decimal places (.e.g 1.1k)
			pct: d3Locale.format('.2%'), // % to 2 decimal places (.e.g 5.40%)
			pct1: d3Locale.format('.1%'), // % to 1 decimal places (.e.g 5.4%)
			r1: d3Locale.format('.1r'), // Rounded to 1 significant number (.e.g 512 => 500, 4.122 => 4)
			r2: d3Locale.format('.2r'), // Rounded to 2 significant numbers (.e.g 512 => 510, 4.122 => 4.1)
			rPct: d3Locale.format('.0%'), // % to 0 decimal places (.e.g 5%)
			round1: d => gen(round(d, 1)), // Round to 0-1 decimal places (e.g. 5.1, 4)
			round: d => gen(round(d, 2)), // Rounded to 0-2 decimal places (.e.g 5.12, 4.1)
			time: d => (d < 0 ? '-' : '') + Math.floor(Math.abs(d) / 60) + ':' + ('00' + Math.floor(Math.abs(d) % 60)).substr(-2, 2)
		},
		translate,
		units: {
			CR: translate('CR'), // Credits
			kg: translate('kg'), // Kilograms
			kgs: translate('kg/s'), // Kilograms per second
			km: translate('km'), // Kilometers
			Ls: translate('Ls'), // Light Seconds
			LY: translate('LY'), // Light Years
			MJ: translate('MJ'), // Mega Joules
			'm/s': translate('m/s'), // Meters per second
			'°/s': translate('°/s'), // Degrees per second
			MW: translate('MW'), // Mega Watts (same as Mega Joules per second)
			mps: translate('m/s'), // Metres per second
			ps: translate('/s'), // Per second
			pm: translate('/min'), // Per minute
			s: translate('secs'), // Seconds
			T: translate('T') // Metric Tons
		}
	};
}

/**
 * The list of available languages
 * @type {Object}
 */
export const Languages = {
	en: 'English'
};
