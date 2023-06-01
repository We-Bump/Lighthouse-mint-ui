export const Hex2Rgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const shortenPublicKey = (publicKey: string, len?: number) => {
    try {
        if (len) {
            return publicKey.slice(0, len)
        }
        return publicKey.slice(0, 5) + "..." + publicKey.slice(-5);
    } catch (e) {
        return publicKey;
    }
}