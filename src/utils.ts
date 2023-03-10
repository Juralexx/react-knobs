/**
 * Convert Hexadecimal color to RGB
 * @param c The hex color to convert
 */

export function HEXtoRGB(c: any) {
    if (/^#([a-f0-9]{3}){1,2}$/.test(c)) {
        if (c.length === 4) {
            c = '#' + [c[1], c[1], c[2], c[2], c[3], c[3]].join('');
        }
        c = '0x' + c.substring(1);
        return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
    }
    else return c;
}

/**
 * Convert RGB color to HSL
 * @param rgb The RGB color to convert
 */

export function RGBtoHSL(rgb: string) {
    let RGB = rgb.split(',')

    let r = Number(RGB[0]);
    let g = Number(RGB[1]);
    let b = Number(RGB[2]);

    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0)
        h = 0;
    else if (cmax === r)
        h = ((g - b) / delta) % 6;
    else if (cmax === g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;

    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l / 10).toFixed(1);

    return {
        hsl: "hsl(" + h + "," + s + "%," + l + "%)",
        h: h,
        s: s,
        l: l,
    };
}

export const getKnobColor = (color: string) => {
    const RGBRegexp = new RegExp(/(\d{1,3}), (\d{1,3}), (\d{1,3})/, 'i')
    if (RGBRegexp.test(color)) {
        let hsl = RGBtoHSL(color)
        return hsl
    } else {
        const HEXRegexp = new RegExp(/^#[0-9a-f]{3,6}$/i, 'i')
        if (HEXRegexp.test(color)) {
            let rgb = HEXtoRGB(color)
            let hsl = RGBtoHSL(rgb)
            return hsl
        }
    }
}