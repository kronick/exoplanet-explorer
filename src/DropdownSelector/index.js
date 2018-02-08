import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DropdownSelector extends Component {
  /** Normalize onChange events to send only the relevant
   *  info up to the parent.
   */
  onChange = (ev) => {
      this.props.onChange(ev.target.value, this.props.id);
  }

  render() {
    // Map options array prop to an arry of <option> jsx tags
    const options = this.props.options.map(o => (
      <option value={o} key={o}>
        {o}
      </option>
    ));

    // Render the <select> tag populated with options
    return (
      <div className='code'>
        <label className='f6 mr2 mb1 db' htmlFor={this.props.id}>{this.props.label}</label>
        <select className='code'
                onChange={this.onChange}
                value={this.props.selected}
                id={this.props.id}>
          {options}
        </select>
      </div>
    )
  }
}

// defaultProps and propTypes help document the props available for this component.
DropdownSelector.defaultProps = {
  options: [],
  onChange: () => {},
  selected: undefined,
  id: '',
  label: ''
};

// propTypes also enforce these types and runtime and will throw a
// warning if props of the incorrect type are sent to this component.
DropdownSelector.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  selected: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string
};
