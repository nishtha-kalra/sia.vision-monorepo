'use client';
import { useState, useEffect } from 'react';

interface GeoLocation {
  country: string;
  countryCode: string;
  flag: string;
  dialCode: string;
  city?: string;
  region?: string;
  timezone?: string;
}

interface GeoLocationState {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
}

// Country code to dial code mapping (comprehensive)
const COUNTRY_DIAL_CODES: Record<string, string> = {
  'US': '+1', 'CA': '+1', 'GB': '+44', 'AU': '+61', 'DE': '+49',
  'FR': '+33', 'JP': '+81', 'IN': '+91', 'BR': '+55', 'MX': '+52',
  'IT': '+39', 'ES': '+34', 'NL': '+31', 'SE': '+46', 'NO': '+47',
  'DK': '+45', 'FI': '+358', 'RU': '+7', 'CN': '+86', 'KR': '+82',
  'SG': '+65', 'HK': '+852', 'TH': '+66', 'ID': '+62', 'MY': '+60',
  'PH': '+63', 'NZ': '+64', 'ZA': '+27', 'EG': '+20', 'NG': '+234',
  'TR': '+90', 'AE': '+971', 'IR': '+98', 'IE': '+353', 'CH': '+41',
  'AT': '+43', 'BE': '+32', 'PL': '+48', 'CZ': '+420', 'HU': '+36',
  'UA': '+380', 'PE': '+51', 'CO': '+57', 'AR': '+54', 'CL': '+56',
  'VE': '+58', 'UY': '+598', 'PY': '+595', 'BO': '+591', 'EC': '+593',
  'CR': '+506', 'PA': '+507', 'GT': '+502', 'HN': '+504', 'SV': '+503',
  'NI': '+505', 'DO': '+1', 'PR': '+1', 'JM': '+1', 'TT': '+1',
  'BB': '+1', 'BS': '+1', 'BZ': '+501', 'GY': '+592', 'SR': '+597',
  'GF': '+594', 'FK': '+500', 'GL': '+299', 'IS': '+354', 'FO': '+298',
  'EE': '+372', 'LV': '+371', 'LT': '+370', 'BY': '+375', 'MD': '+373',
  'RO': '+40', 'BG': '+359', 'GR': '+30', 'CY': '+357', 'MT': '+356',
  'AD': '+376', 'MC': '+377', 'SM': '+378', 'VA': '+39', 'LI': '+423',
  'LU': '+352', 'SI': '+386', 'HR': '+385', 'BA': '+387', 'RS': '+381',
  'ME': '+382', 'MK': '+389', 'AL': '+355', 'XK': '+383', 'SK': '+421',
  'IL': '+972', 'PS': '+970', 'JO': '+962', 'LB': '+961', 'SY': '+963',
  'IQ': '+964', 'KW': '+965', 'SA': '+966', 'BH': '+973', 'QA': '+974',
  'OM': '+968', 'YE': '+967', 'AF': '+93', 'PK': '+92', 'BD': '+880',
  'LK': '+94', 'MV': '+960', 'BT': '+975', 'NP': '+977', 'MM': '+95',
  'LA': '+856', 'KH': '+855', 'VN': '+84', 'MN': '+976', 'KZ': '+7',
  'KG': '+996', 'TJ': '+992', 'UZ': '+998', 'TM': '+993', 'AZ': '+994',
  'AM': '+374', 'GE': '+995', 'TW': '+886', 'MA': '+212', 'TN': '+216',
  'DZ': '+213', 'LY': '+218', 'SD': '+249', 'TZ': '+255', 'KE': '+254',
  'UG': '+256', 'RW': '+250', 'BI': '+257', 'DJ': '+253', 'SO': '+252',
  'ET': '+251', 'ER': '+291', 'MW': '+265', 'ZM': '+260', 'ZW': '+263',
  'BW': '+267', 'SZ': '+268', 'LS': '+266', 'MZ': '+258', 'MG': '+261',
  'MU': '+230', 'RE': '+262', 'YT': '+262', 'KM': '+269', 'SC': '+248',
  'SH': '+290', 'ST': '+239', 'CV': '+238', 'GW': '+245', 'GN': '+224',
  'SL': '+232', 'LR': '+231', 'CI': '+225', 'GH': '+233', 'TG': '+228',
  'BJ': '+229', 'NE': '+227', 'BF': '+226', 'ML': '+223', 'SN': '+221',
  'MR': '+222', 'GM': '+220', 'GQ': '+240', 'GA': '+241', 'CG': '+242',
  'CD': '+243', 'AO': '+244', 'CM': '+237', 'CF': '+236', 'TD': '+235'
};

// IPinfo API endpoint (free tier: 50,000 requests/month)
const IPINFO_API_URL = 'https://ipinfo.io/json';

export const useGeoLocation = () => {
  const [state, setState] = useState<GeoLocationState>({
    location: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Use IPinfo.io API - highly accurate and reliable
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        const response = await fetch(IPINFO_API_URL, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.bogon) {
          // Handle private/local IP addresses
          throw new Error('Private IP address detected');
        }

        // Parse location data from IPinfo response
        const countryCode = data.country?.toUpperCase() || 'US';
        const geoData: GeoLocation = {
          country: getCountryName(countryCode),
          countryCode: countryCode,
          city: data.city || undefined,
          region: data.region || undefined,
          timezone: data.timezone || undefined,
          flag: `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`,
          dialCode: COUNTRY_DIAL_CODES[countryCode] || '+1'
        };

        setState({
          location: geoData,
          loading: false,
          error: null
        });

        console.log('IP Geolocation detected:', {
          country: geoData.country,
          code: geoData.countryCode,
          city: geoData.city,
          region: geoData.region
        });

      } catch (error) {
        console.error('IP geolocation failed:', error);
        
        // Fallback to browser locale detection
        const fallbackCountry = getBrowserFallback();
        
        setState({
          location: {
            country: getCountryName(fallbackCountry),
            countryCode: fallbackCountry,
            flag: `https://flagcdn.com/24x18/${fallbackCountry.toLowerCase()}.png`,
            dialCode: COUNTRY_DIAL_CODES[fallbackCountry] || '+1'
          },
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to detect location'
        });
      }
    };

    detectLocation();
  }, []);

  const getBrowserFallback = (): string => {
    try {
      // Try browser locale first
      const locale = navigator.language || navigator.languages?.[0] || 'en-US';
      const localeCountry = locale.split('-')[1]?.toUpperCase();
      if (localeCountry && COUNTRY_DIAL_CODES[localeCountry]) {
        return localeCountry;
      }

      // Try timezone as secondary fallback
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('America')) return 'US';
      if (timezone.includes('Europe')) return 'GB';
      if (timezone.includes('Asia/Tokyo')) return 'JP';
      if (timezone.includes('Asia/Shanghai')) return 'CN';
      if (timezone.includes('Australia')) return 'AU';
      
      return 'US';
    } catch {
      return 'US';
    }
  };

  const getCountryName = (countryCode: string): string => {
    const countryNames: Record<string, string> = {
      'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom',
      'AU': 'Australia', 'DE': 'Germany', 'FR': 'France', 'JP': 'Japan',
      'IN': 'India', 'BR': 'Brazil', 'MX': 'Mexico', 'IT': 'Italy',
      'ES': 'Spain', 'NL': 'Netherlands', 'SE': 'Sweden', 'NO': 'Norway',
      'DK': 'Denmark', 'FI': 'Finland', 'RU': 'Russia', 'CN': 'China',
      'KR': 'South Korea', 'SG': 'Singapore', 'HK': 'Hong Kong',
      'TH': 'Thailand', 'ID': 'Indonesia', 'MY': 'Malaysia', 'PH': 'Philippines',
      'NZ': 'New Zealand', 'ZA': 'South Africa', 'EG': 'Egypt', 'NG': 'Nigeria',
      'TR': 'Turkey', 'AE': 'United Arab Emirates', 'IR': 'Iran',
      'IE': 'Ireland', 'CH': 'Switzerland', 'AT': 'Austria', 'BE': 'Belgium',
      'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary', 'UA': 'Ukraine',
      'PE': 'Peru', 'CO': 'Colombia', 'AR': 'Argentina', 'CL': 'Chile'
    };
    
    return countryNames[countryCode] || countryCode;
  };

  const getDialCode = (countryCode: string): string => {
    return COUNTRY_DIAL_CODES[countryCode.toUpperCase()] || '+1';
  };

  const getFlagUrl = (countryCode: string): string => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
  };

  return {
    ...state,
    getDialCode,
    getFlagUrl
  };
}; 