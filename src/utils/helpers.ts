export const Hex2Rgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const shortenPublicKey = (publicKey: string, len: number=5) => {
    if (!publicKey) return publicKey; 
    try {
        return publicKey.slice(0, len) + "..." + publicKey.slice(-len);
    } catch (e) {
        return publicKey;
    }
}

export const formatNumber = (number:any) => {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0, 
        maximumFractionDigits: 20, 
    });

    return formatter.format(number);
}
