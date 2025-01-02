import 'bootstrap/dist/css/bootstrap.min.css';
import './about.css';

export default function About() {
    return <div className='aboutPage'>
        <h1>About AtlasNinja</h1>
        <p>AtlasNinja is an awesome website about the countries of Earth.</p>

        <h2>What is this about?</h2>
        <p>AtlasNinja is a now open source engine/template/library to help you build stunning choropleth maps to visualize data about the countries of the world.
            What you are seeing now is a demo of the capabilitites, like:
            <ul>
                <li>Coloring of regions based on a range with different color sets</li>
                <li>Binary coloring</li>
                <li>Data selector dropdown</li>
                <li>Hovering tooltip</li>
                <li>Infobox with detaild info on click</li>
                <li>Legend box</li>
                <li>Sharing link for the selected view</li>
            </ul>

            Data in this demo is more than likely outdated now including the facts and map data (considering debated or volatile border situations in some areas)
        </p>
        <h2>Contact</h2>
        <p>In case you have feedback or questions please open a ticket on the project's GitHub page
        </p>
        <p>
            <a href='https://github.com/tmsvr/atlas-ninja/issues'> AtlasNinja on GitHub</a>
        </p>
        <p>
            <i>AtlasNinja was built by B.Sz. and Imre Tomosvari - Talqum 2022</i>
        </p>
    </div>
}