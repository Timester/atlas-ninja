import React from 'react';
import { numberWithCommas } from './utils'
import Control from "react-leaflet-custom-control";

import './infobox.css';

export function InfoBox({ data, scope, scopeSubKey, open, closeHandler }) {

  let infoBox;

  if (data && data.stats && open) {
    let currentData;
    let description;
    let value;
    if (scope.type === 'multivalue_enum') {
      currentData = data.stats[scope.key][scopeSubKey];
      description = currentData.value ? scope.value.find(e => e.key === scopeSubKey).description : '-';
      value = currentData.value ? scope.value.find(e => e.key === scopeSubKey).short_name : '-';
    } else if (scope.type === 'numeric') {
      currentData = data.stats[scope.key];
      description = scope.description;
      value = (currentData.value !== null && !isNaN(currentData.value)) ? numberWithCommas(currentData.value) : '-';
    } else if (scope.type === 'enum') {
      currentData = data.stats[scope.key];
      description = scope.description;
      value = currentData.value;
    }

    const licenseUrl = currentData.license ? <a href={currentData.license} target='_blank' rel='noreferrer'>license</a> : '-' ; 
    const originDate = currentData.origin_date ? currentData.origin_date : '-';
    
    let sourceUrl = '-';
    
    if (currentData.source) {
      const sourceLabel = currentData.source.match('http[s]?://([a-zA-Z0-9.-]+)');
      sourceUrl = currentData.source.startsWith('http') ? <a href={currentData.source} target='_blank' rel='noreferrer'>{sourceLabel[1]}</a> : currentData.source;
    }

    const flagUrl = '/flags/' + data.stats.iso_a3 + '.png';

    infoBox = <div id='infoBox' className='info'>
      <div id="title-block">
        <img id="title-flag" src={flagUrl} alt="Country flag"></img>
        <div id="titles">
          <h5 id='infoMainTitle'>{data.stats.formal_en}</h5>
          <h6 id='infoSubTitle'>({data.stats.iso_a3} - {data.stats.country_name})</h6>
        </div>
        <button className='close-button' onClick={closeHandler}>
          <i className="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>
      <div id='mainInfo'>
        <h6 className='infoSectionTitle'>Selected data</h6>
        <span className='infoLabel'>{scope.name}:</span> {value} {scope.unit}
        <br></br>
        <span className='infoLabel'>Description:</span> {description}
        <br></br>
        <span className='infoLabel'>Origin date:</span> {originDate}
        <br></br>
        <span className='infoLabel'>Source:</span> {sourceUrl} ({licenseUrl})
      </div>
      <div className='infoSection'>
        <h6 className='infoSectionTitle'>Country info</h6>
        <span className='infoLabel'>Capital:</span> {data.stats.capital_city}
        <br></br>
        <span className='infoLabel'>Region:</span> {data.stats.region_un}
        <br></br>
        <span className='infoLabel'>Sub-Region:</span> {data.stats.subregion}
      </div>
    </div>
  } else {
    return <Control position='topright'></Control>
  }

  return (
    <Control position='topright'>
      {infoBox}
    </Control>
  )
}