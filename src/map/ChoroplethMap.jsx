import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

import { InfoBox } from './InfoBox';
import { MapControls } from './MapControls';
import { Legend } from './Legend';
import { getColor, numberWithCommas, validateNumber } from './utils';

import 'leaflet/dist/leaflet.css';
import './choroplethmap.css';
import './infotooltip.css';

export default function ChoroplethMap() {
    // URL PARAMS
    const [searchParams] = useSearchParams();

    // LOAD MAP DATA
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [countries, setGeodata] = useState({});
    const [dataScopes, setMetadata] = useState(null);
    const [statsData, setData] = useState(null);
    // LOAD MAP DATA

    const [dataScope, setDataScope] = useState(null);
    const [dataScopeSubKey, setDataScopeSubKey] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [infoBoxOpen, setInfoBoxOpen] = useState(false);

    const geoMap = useRef(null);

    const handleInfoBoxClosed = () => {
        setInfoBoxOpen(false);
    }

    const handleDataScopeChange = event => {
        const rawScopeKey = event.target.value;
        const parsedScopeKey = rawScopeKey.includes('/') ? event.target.value.substring(0, event.target.value.indexOf('/')) : event.target.value;
        const parsedScopeSubKey = rawScopeKey.includes('/') ? event.target.value.substring(event.target.value.indexOf('/') + 1) : null;

        setDataScope(dataScopes.find(element => element.key === parsedScopeKey));
        setDataScopeSubKey(parsedScopeSubKey);
    }

    const onEachFeature = useCallback((feature, layer) => {
        let value = null;
        let originDate = null;
        let name = null;
        let currentData = statsData[feature.properties.iso_a3];

        if (currentData) {
            name = currentData.country_name;
            if (dataScope.type === 'numeric') {
                if (currentData[dataScope.key]) {
                    value = (currentData[dataScope.key].value !== null && !isNaN(currentData[dataScope.key].value)) ? numberWithCommas(currentData[dataScope.key].value) : '-';
                    originDate = currentData[dataScope.key].origin_date ? currentData[dataScope.key].origin_date : '-';
                }
            } else if (dataScope.type === 'multivalue_enum') {
                value = currentData[dataScope.key][dataScopeSubKey].value ? dataScope.value.find(e => e.key === dataScopeSubKey).short_name : '-';
                originDate = currentData[dataScope.key][dataScopeSubKey].origin_date ? currentData[dataScope.key][dataScopeSubKey].origin_date : '-';
            } else if (dataScope.type === 'enum') {
                value = currentData[dataScope.key].value ? currentData[dataScope.key].value : '-';
                originDate = currentData[dataScope.key].origin_date ? currentData[dataScope.key].origin_date : '-';
            }

            if (geoMap.current) {
                const current = geoMap.current.getLayers().find(e => e.feature.properties.iso_a3 === feature.properties.iso_a3);

                current.setTooltipContent(
                    `<div id='infoTooltipContainer'>
                        <div><span>${name}</span></div>
                        <div><span>${dataScope.name}</span>: ${value} ${dataScope.unit ? dataScope.unit : ''}</div>
                        <div><span>Origin date</span>: ${originDate}</div>
                    </div>`
                );
            } else {
                layer.bindTooltip(
                    `<div id='infoTooltipContainer'>
                        <div><span>${name}</span></div>
                        <div><span>${dataScope.name}</span>: ${value} ${dataScope.unit ? dataScope.unit : ''}</div>
                        <div><span>Origin date</span>: ${originDate}</div>
                    </div>`, { sticky: true }
                );

                layer.on({
                    mouseover: e => {
                        let geoLayer = e.target;
                        geoLayer.setStyle({
                            color: '#444',
                            weight: 2
                        });
                        geoLayer.bringToFront();
                        setHoveredCountry({ stats: statsData[geoLayer.feature.properties.iso_a3] });
                    },
                    mouseout: e => {
                        e.target.setStyle({
                            color: '#888',
                            weight: 1
                        });
                        setHoveredCountry(null);
                    },
                    click: () => {
                        setSelectedCountry({
                            stats: statsData[feature.properties.iso_a3]
                        });
                        setInfoBoxOpen(true);
                    }
                });
            }
        }
    }, [statsData, dataScope, dataScopeSubKey]);

    const style = useCallback((feature) => {
        let dataForFeature = statsData[feature.properties.iso_a3];
        let value = null;

        if (dataScope.type === 'numeric') {
            if (dataForFeature && dataForFeature[dataScope.key]) {
                value = dataForFeature[dataScope.key].value;
            }

            let mapStyle = {
                fillColor: getColor(value, dataScope),
                weight: 1.5,
                opacity: 1,
                color: '#888',
                dashArray: '3',
                fillOpacity: 0.7
            };

            return mapStyle;
        } else if (dataScope.type === 'multivalue_enum') {
            if (dataForFeature && dataForFeature[dataScope.key]) {
                value = dataForFeature[dataScope.key][dataScopeSubKey].value;
            }

            let mapStyle = {
                fillColor: getColor(value, dataScope),
                weight: 1.5,
                opacity: 1,
                color: '#888',
                dashArray: '3',
                fillOpacity: 0.7
            };

            return mapStyle;
        } else if (dataScope.type === 'enum') {
            if (dataForFeature && dataForFeature[dataScope.key]) {
                value = dataForFeature[dataScope.key].value;
            }

            let mapStyle = {
                fillColor: getColor(value, dataScope),
                weight: 1.5,
                opacity: 1,
                color: '#888',
                dashArray: '3',
                fillOpacity: 0.7
            };

            return mapStyle;
        }

    }, [dataScope, dataScopeSubKey, statsData]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [geoDataResponse, metaDataResponse, dataResponse] = await Promise.all([
                    fetch("/geodata.json"),
                    fetch("/metadata.json"),
                    fetch("/data.json")
                ]);

                if (geoDataResponse.ok && metaDataResponse.ok && dataResponse.ok) {
                    const geoDataJson = await geoDataResponse.json();
                    const metaDataJson = await metaDataResponse.json();
                    const dataJson = await dataResponse.json();

                    setGeodata(geoDataJson);
                    setMetadata(metaDataJson);
                    setData(dataJson);

                    // SET DEFAULT SCOPE
                    let scope = searchParams.get("scope");
                    let scopeIdx = 0;
                    if (scope) {
                        scopeIdx = metaDataJson.findIndex(e => e.key === scope);
                        if (scopeIdx < 0) {
                            scopeIdx = 0;
                        }
                    }
                    setDataScope(metaDataJson[scopeIdx]);
                    setDataScopeSubKey(searchParams.get("scopeSubKey"));

                    // SET DEFAULT SELECTED COUNTRY
                    let selected = searchParams.get("selected");
                    if (selected) {
                        if (selected in dataJson) {
                            setSelectedCountry({
                                stats: dataJson[searchParams.get("selected")]
                            });
                            setInfoBoxOpen(true);
                        }
                    }
                } else {
                    setError(true);
                }

                setIsLoaded(true);
            } catch (err) {
                setIsLoaded(true);
                setError(err);
            }
        }
        fetchData();
    }, [searchParams]);

    const geoJson = useMemo(() => {
        return <GeoJSON data={countries} style={style} onEachFeature={onEachFeature} ref={geoMap}></GeoJSON>;
    }, [countries, style, onEachFeature]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div className='mainContent'>
            <div className='loader-container'>
                <div className='loader'></div>
                Loading...
            </div>
        </div>;
    } else {
        return (
            <div className='mainContent'>
                <MapContainer
                    center={
                        [validateNumber(searchParams.get('mapX')) ? searchParams.get('mapX') : 40,
                        validateNumber(searchParams.get('mapY')) ? searchParams.get('mapY') : 0]
                    }
                    zoomControl={false}
                    zoom={validateNumber(searchParams.get('mapZoom')) ? searchParams.get('mapZoom') : 2.5}
                    maxZoom={8}
                    minZoom={2}
                    zoomSnap={0.5}
                    zoomDelta={0.5}
                    wheelPxPerZoomLevel={120}
                    maxBoundsViscosity={0.5}
                    maxBounds={L.latLngBounds(new L.LatLng(85, -210), new L.LatLng(-85, 210))}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="blank">OpenStreetMap</a> contributors' />
                    <ZoomControl position='bottomleft' />
                    {geoJson}
                    <InfoBox data={selectedCountry}
                        scope={dataScope}
                        scopeSubKey={dataScopeSubKey}
                        open={infoBoxOpen}
                        closeHandler={handleInfoBoxClosed} />
                    <Legend scope={dataScope} scopeSubKey={dataScopeSubKey} hoveredCountry={hoveredCountry} />
                    <MapControls
                        options={dataScopes}
                        value={dataScope}
                        scopeSubKey={dataScopeSubKey}
                        infoOpen={infoBoxOpen}
                        selectedCountry={selectedCountry}
                        changeHandler={handleDataScopeChange} />
                </MapContainer>
            </div>
        );
    }
}