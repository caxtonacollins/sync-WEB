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
    image: 'https://iconscout.com/free-icon/free-ethereum-icon_283135',
    balance: 5.5,
    value: 12290.08
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
  },
  {
    id: 'starknet',
    symbol: 'STRK',
    name: 'StarkNet',
    price: 1.25,
    change24h: 4.12,
    marketCap: 1250000000,
    image: 'https://starknet.io/favicon.ico',
    balance: 1000,
    value: 1250
  },
  {
    id: 'usdc',
    symbol: 'USDC',
    name: 'USD Coin',
    price: 1.00,
    change24h: 0.01,
    marketCap: 28000000000,
    image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    balance: 5000,
    value: 5000
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
