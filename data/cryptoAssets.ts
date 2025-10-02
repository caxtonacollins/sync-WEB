import { CryptoAsset } from './types';

export const cryptoAssets: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 41235.78,
    change24h: 2.34,
    marketCap: 803456789012,
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    balance: 1.25,
    value: 51544.73
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2234.56,
    change24h: -1.23,
    marketCap: 268901234567,
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    balance: 5.5,
    value: 12290.08
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.45,
    change24h: 3.45,
    marketCap: 15678901234,
    image: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    balance: 0,
    value: 0
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 98.76,
    change24h: 5.67,
    marketCap: 34567890123,
    image: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    balance: 0,
    value: 0
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    price: 0.78,
    change24h: -0.89,
    marketCap: 37654321098,
    image: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    balance: 0,
    value: 0
  }
];



export const getCryptoAssetById = (id: string) => {
  return cryptoAssets.find(asset => asset.id === id);
};

export const getTopCryptoAssets = (limit = 5) => {
  return [...cryptoAssets]
    .sort((a, b) => (b.balance || 0) * b.price - (a.balance || 0) * a.price)
    .slice(0, limit);
};
