import { FlutterwaveResponse, PaymentMethod } from './flutterwave';

// Extend the FlutterWaveProps to include our custom types
// Extend the base Flutterwave config with our custom types
type FlutterwaveConfig = Omit<BaseFlutterWaveConfig, 'callback' | 'onClose' | 'payment_options' | 'customer'> & {
  callback: (response: FlutterwaveResponse) => void;
  onclose?: () => void;
  payment_options?: PaymentMethod[] | string;
  customer: {
    email: string;
    phone_number?: string;
    name: string;
  };
};
