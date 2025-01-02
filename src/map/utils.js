import { colors } from './colors';
import { enumColors } from './enumColors';

export function numberWithCommas(x) {
    if (x != null) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return '';
    }
}

export function validateNumber(x) {
    return x && !isNaN(x);
}

export function getColor(val, dataScope) {
    if (val === null) {
        return '#ddd';
    }

    if (dataScope.type === 'numeric') {
        const colorsToUse = colors[dataScope.color][getColorsIdxForScaleLength(dataScope.scale.length)];

        for (let i = 0; i < dataScope.scale.length; i++) {
            if (val < dataScope.scale[i]) {
                return colorsToUse[i];
            }
        }

        return colorsToUse[colorsToUse.length - 1];
    } else if (dataScope.type === 'multivalue_enum') {
        return enumColors[0][5];
    } else if (dataScope.type === 'enum') {
        const colorsToUse = enumColors[dataScope.color];

        return val === dataScope.value[0] ? colorsToUse[0] : colorsToUse[1];
    }
}

function getColorsIdxForScaleLength(scaleLength) {
    return scaleLength - 2;
}

export async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text);
}