// Map of token symbols to their respective logo paths
const tokenIcons: Record<string, string> = {
    // Cryptocurrencies
    'BTC': '/images/tokens/bitcoin.png',
    'ETH': '/images/tokens/ethereum.png',
    'USDT': '/images/tokens/tether-usdt.png',
    'USDC': '/images/tokens/usd-coin.png',
    'STRK': '/images/tokens/starknet.png',
    'sNGN': '/images/tokens/naira.png',
};

// Default icon for tokens without a specific logo
const DEFAULT_TOKEN_ICON = '/images/tokens/default-token.png';

/**
 * Get the icon path for a given token symbol
 * @param symbol The token symbol (e.g., 'BTC', 'ETH')
 * @returns The path to the token's icon or the default icon if not found
 */
export function getTokenIcon(symbol: string): string {
    if (!symbol) return DEFAULT_TOKEN_ICON;
    return tokenIcons[symbol.toUpperCase()] || DEFAULT_TOKEN_ICON;
}

/**
 * Preload token icons to improve user experience
 */
export function preloadTokenIcons() {
    const icons = new Set(Object.values(tokenIcons));
    icons.add(DEFAULT_TOKEN_ICON);

    icons.forEach(iconPath => {
        const img = new Image();
        img.src = iconPath;
    });
}

// Preload icons when this module is imported
if (typeof window !== 'undefined') {
    preloadTokenIcons();
}
