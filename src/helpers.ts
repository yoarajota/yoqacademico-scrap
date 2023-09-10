export function normalize(string: string) {
    return string.normalize().trim().replace(/\n/g, "").replace(/\s+/g, ' ');
}