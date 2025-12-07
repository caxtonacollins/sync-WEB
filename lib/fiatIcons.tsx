import React from 'react';
import icons from 'currency-icons';
import { Globe } from 'lucide-react';

type CurrencyIcon = {
  name: string;
  symbol: string;
  icon: string;
};

type CurrencyIcons = {
  [key: string]: CurrencyIcon | undefined;
};

// Map of fiat currency codes to their respective currency icons
const fiatIcons: CurrencyIcons = {
  // Fiat Currencies
  'USD': icons['USD'],
  'EUR': icons['EUR'],
  'GBP': icons['GBP'],
  'NGN': icons['NGN'],
  'KES': icons['KES'],
  'GHS': icons['GHS'],
  'ZAR': icons['ZAR'],
  'XAF': icons['XAF'],
  'XOF': icons['XOF'],
  'EGP': icons['EGP'],
};

// Default icon for fiat currencies without a specific icon
const DEFAULT_FIAT_ICON = {
  name: 'Currency',
  symbol: '¤',
  icon: ''
};

/**
 * Get the icon data for a given fiat currency code
 * @param code The fiat currency code (e.g., 'USD', 'EUR')
 * @returns The currency icon data or the default icon if not found
 */
function getFiatIconData(code: string): CurrencyIcon {
  if (!code) return DEFAULT_FIAT_ICON;
  return fiatIcons[code.toUpperCase()] ?? DEFAULT_FIAT_ICON;
}

interface FiatIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  code: string;
  size?: number;
  showSymbol?: boolean;
  className?: string;
}

/**
 * Fiat icon component that displays currency icon or symbol
 */
const FiatIcon: React.FC<FiatIconProps> = ({
  code,
  size = 32,
  showSymbol = true,
  className = '',
  ...props
}) => {
  const iconData = getFiatIconData(code);
  
  if (iconData.icon) {
    return (
      <div className={`inline-flex items-center ${className}`} {...props}>
        {/* <img 
          src={iconData.icon} 
          alt={`${iconData.name} icon`} 
          width={size} 
          height={size}
          className="rounded-full bg-white p-1"
        /> */}
        {showSymbol && <span className="ml-1 font-semibold text-2xl">{iconData.symbol}</span>}
      </div>
    );
  }

  // Fallback to symbol if no icon is available
  return (
    <div className={`inline-flex items-center ${className}`} {...props}>
      <div 
        className="inline-flex items-center justify-center rounded-full bg-gray-200"
        style={{ width: size, height: size }}
      >
        <Globe size={size * 0.6} />
      </div>
      {showSymbol && <span className="ml-1">{iconData.symbol}</span>}
    </div>
  );
};

export { FiatIcon };
export const SUPPORTED_FIAT_CURRENCIES = Object.keys(fiatIcons);
