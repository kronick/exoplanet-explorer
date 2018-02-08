import React, { Component } from 'react';

// These are the two other React components used in this app
import DropdownSelector from '../DropdownSelector';
import Scatterplot from '../Scatterplot';

// Use separate module for data processing
import { cleanRow, numericColumns } from '../clean-data';

import {csv as fetchCSV} from 'd3-fetch';

const config = {
  planetDataFile: "data/phl_hec_all_confirmed.csv"
};

class App extends Component {
  constructor(props) {
    super(props);

    // Initial state
    this.state = {
      dimensionX: "S. Mass (SU)",
      dimensionY: "P. Mass (EU)",
      planetData: undefined,
      dataForScatterplot: undefined
    };

  }

  componentDidUpdate(prevProps, prevState) {
      // Check if dimension X or Y has changed,
      // if so, update data sent to scatterplot and histogram
      // This happens here to avoid doing this compuation unneccesarily with every render
      if(this.state.planetData === undefined) {
        // Nothing to do if we have no planet data loaded
        return;
      }

      if (prevState.dimensionX !== this.state.dimensionX ||
          prevState.dimensionY !== this.state.dimensionY ||
          prevState.planetData !== this.state.planetData) {
        this.setState({
          dataForScatterplot: this.state.planetData.map(d => {
            return {
              name: d.name,
              x: d[this.state.dimensionX],
              y: d[this.state.dimensionY]
            }
          })
        });
      }
  }

  componentWillMount() {
    // On initial load, fetch the CSV containing all the data
    fetchCSV(config.planetDataFile, cleanRow)
      .then((data) => {
        this.setState({planetData: data});
        console.log(data);
      });
  }

  render() {
    // Render the scatterplot only once the data has been loaded
    let scatterplot = undefined;
    if (this.state.dataForScatterplot !== undefined) {
      console.log(this.state.dataForScatterplot)
      scatterplot = (
        <Scatterplot points={this.state.dataForScatterplot}
          labelX={this.state.dimensionX}
          labelY={this.state.dimensionY}/>
      );
    }

    // This render function contains most of the page layout HTML & CSS classes
    // The sub-components draw themselves to fill the DIVs below
    // The CSS framework I'm using is http://tachyons.io/ and it follows a
    // "atomic CSS" pattern that favors very small utility classes
    // As a result, I don't have an external custom stylesheet for page layout.
    return (
      <div className="w-100 vh-100 pa3 flex flex-column overflow-hidden justify-center">
        <div className="f2 tc code">
          Exoplanet Data Explorer
        </div>
        <div className="w-100 pa3 flex flex-column flex-row-ns justify-around">
          <div className="mb3 mb0-ns">
            <DropdownSelector
              options={ numericColumns }
              selected={this.state.dimensionX}
              onChange={this.onChangeDimension}
              id="dimensionX" label="X-Axis"/>
          </div>
          <div>
            <DropdownSelector
              options={ numericColumns }
              selected={this.state.dimensionY}
              onChange={this.onChangeDimension}
              id="dimensionY" label="Y-Axis"/>
          </div>
        </div>

        { scatterplot }
      </div>
    );
  }

  /** Handler for when dropdown selection changes */
  onChangeDimension = (value, id) => {
    const newState = {};
    newState[id] = value;
    this.setState(newState);
  }
}

export default App;
