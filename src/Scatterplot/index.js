import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Measure from 'react-measure';

// Build a single d3 object out of the needed modules
const d3 = Object.assign({},
              require('d3'),
              require('d3-selection'),
              require('d3-scale'),
              require('d3-transition'),
              require('d3-array'),
              require('d3-axis'));


export default class Scatterplot extends Component {
  constructor(props) {
    super(props);

    // Will store ref to SVG element so D3 can access it
    // (Without setting an explicit id, so this component could be re-used
    //  on the same page multiple times)
    this.svgEl = undefined;

    this.state = {
      // Dimensions will be calculated later with react-measure
      dimensions: undefined
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Manually check if dimensions or point data have changed.
    // If so, we need to manually update d3 data
    if (this.state.dimensions !== prevState.dimensions) {
      this.updatePoints(0); // Update without a transition on page resize
    }
    else if(this.props.points !== prevProps.points) {
        this.updatePoints(); // Update with default transition when data changes
    }
  }

  componentDidMount() {
    // On initial component load, set up basic SVG structure with D3
    this.setupCanvas();
  }

  render() {
    // Render the <svg> canvas wrapped in a `react-measure` component
    // The `Measure` component lets us listen for window resize events and
    // determine the canvas' pixel size in a declarative manner

    return (
      <Measure onResize={ this.onResize }>
        {({ contentRect, measureRef }) =>
          (
          <div ref={measureRef} className="w-100 h-100 overflow-hidden">
            <svg ref={n => this.svgEl = n} className="w-100 h-100"/>
          </div>
          )
        }
      </Measure>
    )
  }

  /** Helper function for react-measure event handler */
  onResize = (contentRect) => {
    this.setState({ dimensions: contentRect.entry });
  }

  /** Calculate D3 scale functions given component dimensions */
  calculateScales() {
    // Don't do anything if we don't have any data
    if (!this.props.points) {
      return;
    }

    // Set domain based on min and max of current data
    const domainX = [
      d3.min(this.props.points.map(p => p.x)),
      d3.max(this.props.points.map(p => p.x))
    ];

    const domainY = [
      d3.min(this.props.points.map(p => p.y)),
      d3.max(this.props.points.map(p => p.y))
    ];


    // Set range based on window size
    const paddingX = 10;
    const paddingY = 10;

    const rangeX = [
      this.props.paddingX,
      this.state.dimensions.width - this.props.paddingX
    ];

    const rangeY = [
      this.state.dimensions.height - this.props.paddingY,
      this.props.paddingY
    ];

    return {
      xScale: d3.scaleLinear().domain(domainX).range(rangeX),
      yScale: d3.scaleLinear().domain(domainY).range(rangeY)
    }
  }

  /** Update point positions and axes using d3 */
  updatePoints(transitionDuration = 500) {
    const { xScale, yScale } = this.calculateScales();
    // Don't do anything if the scales aren't ready
    if(!xScale || !yScale) {
      return;
    }

    // Transition the points into their new positions
    d3.select(this.svgEl)
      .selectAll('circle')
      .data(this.props.points)
      .transition()
      .duration(transitionDuration)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y));

    // Update the X and Y axes
    const axisBottom = this.state.dimensions.height - this.props.paddingY;
    d3.select(this.svgEl)
      .select('#xAxis')
      .attr('transform', `translate(0, ${axisBottom})`)
      .call(d3.axisBottom()
              .scale(xScale));

    d3.select(this.svgEl)
      .select('#yAxis')
      .attr('transform', `translate(${this.props.paddingX}, 0)`)
      .call(d3.axisLeft()
              .scale(yScale));

    // Update labels on X and Y axes
    d3.select(this.svgEl)
      .select('#xAxisLabel')
      .attr('transform',
            `translate(${this.state.dimensions.width / 2},` +
                      `${this.state.dimensions.height - 20})`)
      .text(this.props.labelX)

    d3.select(this.svgEl)
      .select('#yAxisLabel')
      .attr('transform',
            `translate(20, ${this.state.dimensions.height / 2}) ` +
            `rotate(-90)`
          )
      .text(this.props.labelY)
  }

  setupCanvas() {
    // Create circle elements for each data point.
    // Their positions will be set later.
    d3.select(this.svgEl)
      .selectAll('circle')
      .data(this.props.points)
      .enter()
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 3);

    // Placeholder for x-axis
    d3.select(this.svgEl)
      .append('g')
      .classed('code', true)
      .attr('id', 'xAxis');

    // Placeholder for y-axis
    d3.select(this.svgEl)
      .append('g')
      .classed('code', true)
      .attr('id', 'yAxis');

    // Placeholder for x-axis label
    d3.select(this.svgEl)
      .append('text')
      .attr('id', 'xAxisLabel')
      .classed('code f5', true)
      .attr('text-anchor', 'middle');

    // Placeholder for y-axis label
    d3.select(this.svgEl)
      .append('text')
      .attr('id', 'yAxisLabel')
      .classed('code f5', true)
      .attr('text-anchor', 'middle');
  }
}

// defaultProps and propTypes help document the props available for this component.
Scatterplot.defaultProps = {
  points: [],
  title: 'Scatterplot',
  labelX: 'X Axis',
  labelY: 'Y Axis',
  paddingX: 80,
  paddingY: 60,
  onHover: () => {}
};

// propTypes also enforce these types and runtime and will throw a
// warning if props of the incorrect type are sent to this component.
Scatterplot.propTypes = {
  points: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number
  })),

  title: PropTypes.string,
  labelX: PropTypes.string,
  labelY: PropTypes.string,

  paddingX: PropTypes.number,
  paddingY: PropTypes.number,

  onHover: PropTypes.func
};
