import React from 'react';
import { FlutterWaveButton as BaseFlutterWaveButton, FlutterWaveTypes } from 'flutterwave-react-v3';

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP' | 'GHS';

type PaymentMethod = 
  | 'card' 
  | 'account' 
  | 'banktransfer' 
  | 'ussd' 
  | 'mobilemoneyghana'
  | 'opay'
  | 'internetbanking' 
  | 'applepay' 
  | 'googlepay' 
  | 'enaira';

// Types for Flutterwave configuration
export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency?: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  meta?: Record<string, string>;
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  callback: (response: FlutterwaveResponse) => void;
  onclose: () => void;
  redirect_url?: string;
  subaccounts?: Array<{
    id: string;
    transaction_charge_type: 'percentage' | 'flat';
    transaction_charge: number;
  }>;
  integrity_hash?: string;
  payment_plan?: string;
  subaccount?: {
    id: string;
    transaction_split_ratio?: number;
    transaction_charge_type?: 'percentage' | 'flat';
    transaction_charge?: number;
  };
}

export interface FlutterwaveResponse {
  currency?: string;
  customer: {
    email: string;
    name: string;
    phone_number: string;
  };
  flw_ref: string;
  status: string;
  transaction_id: number;
  tx_ref: string;
  payment_plan?: string;
  [key: string]: any;
}

// Type for FlutterWaveButton props
type FlutterWaveButtonProps = {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  public_key: string;
  onSuccess?: (response: FlutterwaveResponse) => void;
  onClose: () => void;
  onclose?: () => void;
  children?: React.ReactNode;
} & Omit<FlutterwaveConfig, 'public_key' | 'onclose'>;

// The FlutterWaveButton component will handle script loading automatically
export const FlutterwaveButtonWrapper: React.FC<{
  config: Omit<FlutterwaveConfig, 'public_key'>;
  className?: string;
  children?: React.ReactNode;
}> = ({ config, className, children }) => {
  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '';
  
  if (!publicKey) {
    console.error('Flutterwave public key is not set');
    return null;
  }

  const handlePayment = (response: FlutterwaveResponse) => {
    if (config.callback) {
      config.callback(response);
    }
    if (response.status === 'successful' && buttonProps.onSuccess) {
      buttonProps.onSuccess(response);
    }
  };

  const handleClose = () => {
    if (config.onclose) {
      config.onclose();
    }
  };

  const buttonProps: FlutterWaveButtonProps = {
    text: typeof children === 'string' ? children : 'Pay Now',
    callback: handlePayment,
    onClose: handleClose,
    onclose: handleClose, // Flutterwave expects both onClose and onclose
    customizations: config.customizations,
    customer: config.customer,
    amount: config.amount,
    currency: config.currency,
    tx_ref: config.tx_ref,
    public_key: publicKey,
    payment_options: (() => {
      if (Array.isArray(config.payment_options)) {
        return config.payment_options.join(', ');
      }
      return config.payment_options || 'card, ussd, banktransfer';
    })(),
    meta: config.meta,
    redirect_url: config.redirect_url,
    subaccounts: config.subaccounts,
    integrity_hash: config.integrity_hash,
    payment_plan: config.payment_plan,
    subaccount: config.subaccount,
  };

  return (
    <div className={className}>
      <BaseFlutterWaveButton {...buttonProps} />
    </div>
  );
};

// For backward compatibility
export const launchFlutterwave = (config: Omit<FlutterwaveConfig, 'public_key'>) => {
  console.warn('launchFlutterwave is deprecated. Please use FlutterwaveButtonWrapper component instead.');
  
  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '';
  if (!publicKey) {
    console.error('Flutterwave public key is not set');
    return;
  }

  const fwConfig = {
    ...config,
    public_key: publicKey,
  };

  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => {
      if (window.FlutterwaveCheckout) {
        window.FlutterwaveCheckout(fwConfig);
      }
    };
    document.body.appendChild(script);
  }
};

// For backward compatibility
export const initializeFlutterwave = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.FlutterwaveCheckout) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Flutterwave script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};
