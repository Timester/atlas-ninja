import { getColor, numberWithCommas } from './utils'

import './legend.css';

export function Legend({ scope, scopeSubKey, hoveredCountry }) {
    let legend = [];

    if (scope.type === 'numeric') {
        for (let i = -1; i < scope.scale.length; i++) {
            let from;
            let to;

            if (i === -1) {
                from = Number.NEGATIVE_INFINITY;
                to = scope.scale[0];
            } else {
                from = scope.scale[i];
                to = scope.scale[i + 1];
            }

            let hoveredValue = null;
            if (hoveredCountry && hoveredCountry.stats) {
                if (hoveredCountry.stats[scope.key]) {
                    hoveredValue = hoveredCountry.stats[scope.key].value;
                }
            }

            let left = from != Number.NEGATIVE_INFINITY ? numberWithCommas(from) : 'min';
            let right = numberWithCommas(to);


            if (hoveredValue != null && (      hoveredValue >= from        && (!to || hoveredValue < to))) {
                legend.push(<tr className="legendRowHighlighted" key={from}>
                    <td><i style={{ background: getColor(from + 0.01, scope) }}></i></td>
                    <td className='leftCol'>{left}</td><td>&nbsp;-&nbsp;</td><td className='rightCol'>{right ? right : '∞'}</td>
                </tr>);
            } else {
                legend.push(<tr className="legendRow" key={from}>
                    <td><i style={{ background: getColor(from + 0.01, scope) }}></i></td>
                    <td className='leftCol'>{left}</td><td>&nbsp;-&nbsp;</td><td className='rightCol'>{right ? right : '∞'}</td>
                </tr>);
            }
        }
    } else if (scope.type === 'multivalue_enum') {
        let isPartOfEnum = null;
        if (hoveredCountry && hoveredCountry.stats) {
            if (hoveredCountry.stats[scope.key][scopeSubKey].value) {
                isPartOfEnum = true;
            }
        }

        legend.push(<tr className={isPartOfEnum ? "legendRowHighlighted" : "legendRow"} key={scopeSubKey}>
            <td><i style={{ background: getColor(true, scope) }}></i></td>
            <td className='leftCol'>{scope.value.find(element => element.key === scopeSubKey).name}</td>
        </tr>);
        legend.push(<tr className={!isPartOfEnum && hoveredCountry ? "legendRowHighlighted" : "legendRow"} key={'none'}>
            <td><i style={{ background: getColor(null, scope) }}></i></td>
            <td className='leftCol'>None</td>
        </tr>);
    } else if (scope.type === 'enum') {
        for (let i = 0; i < scope.value.length; i++) {
            let hoveredValue = null;
            if (hoveredCountry && hoveredCountry.stats) {
                if (hoveredCountry.stats[scope.key].value) {
                    hoveredValue = hoveredCountry.stats[scope.key].value;
                }
            }
            
            legend.push(<tr className={hoveredValue === scope.value[i] ? "legendRowHighlighted" : "legendRow"} key={scope.value[i]}>
                <td><i style={{ background: getColor(scope.value[i], scope) }}></i></td>
                <td className='leftCol'>{scope.value[i]}</td>
            </tr>);
        }
    }

    return (
        <div className="info legend leaflet-bottom leaflet-right">
            <table>
                <tbody>
                    {legend}
                </tbody>
            </table>
            <span id="legend-title"> {scope.unit ? '[' + scope.unit + ']' : ''}</span>
        </div>
    )
}