# AtlasNinja - A Leaflet-Based Choropleth Map in React
**A React application for creating interactive world maps with country-level data visualization.**


## Summary

AtlasNinja was originally an online service to explore facts about countries worldwide through interactive maps. While it is no longer available online, I am open-sourcing the project to serve as a template, library, or example for creating choropleth maps in React.

![AtlasNinja interface](https://tmsvr.com/content/images/size/w1600/2022/02/Screenshot-2022-02-28-at-13.03.00.png)

### More Information:
- Original Features: [Introducing AtlasNinja](https://tmsvr.com/introducing-a-new-app-atlasninja/)
- Open-Sourcing Goals: [Open-Sourcing AtlasNinja](https://tmsvr.com/open-sourcing-atlasninja-react-leaflet-choropleth-map)


## Tech Details

- **Frontend Framework**: React 18
- **Mapping Library**: Leaflet 1.9 with react-leaflet
- **Build Tool**: Vite

Note: While I am not a frontend developer, I have done my best to create this app. Some parts might be unconventional or could be improved.

### Data

The project uses hardcoded data files located in the `public` folder:

- **`data.json`**: Contains the main country data (keyed by country ISO 3 codes).
- **`data_debug.json`**: A human-readable version of `data.json` for debugging purposes. Note: `data.json` is ~1.5 MB, while the debug version is ~2.2 MB due to formatting differences and this has measurable performance impact.
- **`geodata.json`**: Contains country borders in the [GeoJSON standard](https://geojson.org). The data comes from [this source](https://geojson-maps.kyd.au) (medium resolution, edited by hand for performance and accuracy).
- **`metadata.json`**: Describes data categories, their properties, and types used in `data.json`.
- **`/memberships/`**: Contains files describing organization memberships for countries (used for specific data categories).

### Known Issues

This project was initially built in early 2022 using `Create React App` with React 17. After migrating to `Vite` and React 18, some bugs were introduced:

- **Data Category Tooltip Issue**:  
  When changing the data category (top-left dropdown), the tooltip still displays "Area" data, regardless of the selected category. This appears to be related to map references in the code, but I have not yet resolved the issue.

## Contributing

Contributions are welcome! If you would like to add features, fix bugs, or improve documentation, please:

1. Open an issue in the [GitHub repository](https://github.com/tmsvr/atlas-ninja/issues) to discuss the changes.
2. Submit a pull request after implementing your changes.

Thank you for contributing to AtlasNinja!


## Usage

1. **Clone this repository**

2. **Install dependencies**  
```npm install```

3. **Start the development server**  
```npm run dev```

After starting the server, a link will appear in the terminal (e.g.,`  ➜  Local:   http://localhost:5173/`)

The project is available under the MIT license which basically means you can do anything with, there is no warannty for the code, you have to include the MIT license text from this project in yours and a copyright notice. 

https://tmsvr.com/content/media/2022/02/atlsninja.mp4

## Support

In case you have any questions, have issues or feedback please open a ticket in the [GitHub isse tracker](https://github.com/tmsvr/atlas-ninja/issues) for the project.