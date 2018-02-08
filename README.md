# Exoplanet explorer
This app lets you explore a [dataset of exoplanet data](public/data/phl_hec_all_confirmed.csv) by plotting any two variables from the dataset on a scatterplot.

## Installation

`npm install && npm start`

This will install dependencies and start a development server where you can preview the app.


## Architecture
This app uses [**React**](https://reactjs.org) for handling user events and application state and [**d3.js**](https://d3js.org) for rendering the scatterplot visualization.

### Build system
The build system is a standard [`create-react-app`](https://github.com/facebook/create-react-app) setup. I didn't need to modify it in any way for this app.

### React components
I've divided the app's functionality into 3 separate components:
- **[App](src/App/index.js)** - The main application wrapper. Handles layout of all children components, asynchronous loading of data, and managing state changes in response to user events. All behavior particular to this application is isolated within this component.
- **[DropdownSelector](src/DropdownSelector/index.js)** - A widget that renders a dropdown menu and label given an array of options. Triggers an `onChange()` event that is passed up to its parent through a prop callback.
- **[Scatterplot](src/Scatterplot/index.js)** - Renders a scatterplot of the given data points using d3. Handles the setup of the d3 SVG canvas and all synchronization between React prop/state changes and d3 re-rendering. Uses [`react-measure`](https://github.com/souporserious/react-measure) to listen for element or window resize events and to calculate SVG dimensions in a declarative manner. This component is a generic scatterplot rendering component--it has no knowledge about the overall application it is used within or the details of the original dataset--so it could be re-used modularly in another application.

### CSS
This app uses the [Tachyons](http://tachyons.io/) CSS framework. Tachyons follows an "atomic CSS" pattern that favors very small utility classes. These utility classes are composed directly in each React component file. As a result, I don't need to manage external custom stylesheets for any of the components or the page layout.

If this pattern feels strange to you (_isn't this just inline style?!!_), I can empathize. I felt this way at first, but have come around to liking it quite a bit. It's a pattern that trades separating concerns by _language_ (CSS/HTML/Javascript) and separates concerns by _application components_ -- each component file contains all information about its styling, structure, and behavior.

## TODO
- I didn't have time to draw binned histograms for the selected features. If I were to implement this, I would create a new React component class for this visualization, similar to the `Scatterplot` component.

- The React–to-d3 interface code proved to be a bit more time consuming than I anticipated. If I were to be doing a lot of this work, I would definitely document this pattern really well to save time in the future for me and my team. There are also several React components that attempt to wrap d3 in some manner. These would be worth taking a look at.

- Finally, I chose to focus on architecture & code style more than visual style in the time I had. I kept the app to a minimal "wireframe" style, but depending on how this would be situated in a larger suite of applications, there is a lot of visual design and styling work left to do.

- The original prompt didn't specify this, but I really think the scatterplot would benefit from hover interactions for each data point. On hover, we could reveal the planet's name and the values of the current variables being displayed. Implementation for this could happen either in pure d3 or by triggering an `onHover` event that renders a dedicated `Tooltip` React component.
