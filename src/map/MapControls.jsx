import React, { useState } from 'react';
import Control from "react-leaflet-custom-control";
import { useMap } from 'react-leaflet';
import { Tooltip } from 'react-tooltip';

import { copyToClipboard } from "./utils";

import './mapcontrols.css';
import 'bootstrap/dist/css/bootstrap.min.css';


export function MapControls({ options, value, scopeSubKey, infoOpen, selectedCountry, changeHandler }) {
    const map = useMap();
    const [tooltipText, setTooltipText] = useState('Copy shareable link to clipboard');

    const clickHandler = () => {
        let center = map.getCenter();
        let mapX = center.lat;
        let mapY = center.lng;
        let mapZoom = map.getZoom();

        let url = window.location.protocol + '//' + window.location.host + '?mapX=' + mapX + '&mapY=' + mapY + '&mapZoom=' + mapZoom;

        if (infoOpen && selectedCountry) {
            url = url + '&selected=' + selectedCountry.stats.iso_a3;
        }

        url = url + '&scope=' + value.key;

        if (scopeSubKey) {
            url = url + '&scopeSubKey=' + scopeSubKey;
        }

        setTooltipText('Share link copied to clipboard!');
        copyToClipboard(url);
    }

    const createNumericOptions = (categoryItems) => {
        return categoryItems.map(e => <option key={e.key} value={e.key}>{e.name}</option>);
    }

    const createMultivalueEnumOptions = (categoryItems) => {
        let optionsArr = [];
        for (const categoryValue of categoryItems[0].value) {
            optionsArr.push(<option key={categoryValue.key} value={categoryItems[0].key + '/' + categoryValue.key}>{categoryValue.short_name}</option>);
        }
        return optionsArr;
    }

    const buildOptions = () => {
        let selectOptionsObj = {};
        const categories = new Set(options.map(e => e.type === 'numeric' || e.type === 'enum' ? e.category : e.category + '_' + e.key));

        for (let category of categories) {
            selectOptionsObj[category] = options.filter(e => e.type === 'numeric' || e.type === 'enum' ? e.category === category : e.category + '_' + e.key === category);
        }

        let selectOptions = [];

        for (const [category, categoryItems] of Object.entries(selectOptionsObj)) {
            selectOptions.push(
                <optgroup key={category} label={categoryItems[0].type === 'numeric' || categoryItems[0].type === 'enum' ? category : category.substring(0, category.indexOf('_')) + ' / ' + categoryItems[0].name}>
                    {categoryItems[0].type !== 'multivalue_enum' ? createNumericOptions(categoryItems) : createMultivalueEnumOptions(categoryItems)}
                </optgroup>
            );
        }

        return selectOptions;
    }

    return (
        <Control position="topleft">
            <div id="data-selector" className="info">
                <span id="data-scope-choser-brand-name">AtlasNinja</span>
                <select id='data-scope-chooser-input' className="col-sm-8 form-select" value={scopeSubKey ? value.key + '/' + scopeSubKey : value.key} onChange={changeHandler}>
                    {buildOptions()}
                </select>
                <i id="share-url-button"
                    className="fa-solid fa-arrow-up-right-from-square fa-lg"
                    onClick={clickHandler}
                    data-tip="" data-event-off="mouseout"></i>
                <Tooltip place="bottom"
                    type="light"
                    effect="solid"
                    delayHide={200}
                    delayShow={200}
                    getContent={() => { return tooltipText; }}
                    afterHide={() => { setTooltipText('Copy shareable link to clipboard'); }} />
            </div>
        </Control>
    );
}