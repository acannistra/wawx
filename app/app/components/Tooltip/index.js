import React from 'react'
import PropTypes from 'prop-types'

export default class Tooltip extends React.Component {

  static propTypes = {
    features: PropTypes.array.isRequired
  };

  render() {
    const { features } = this.props;

    const renderFeature = (feature, i) => {
      if (feature.layer['source'] == "nwac-danger"){
        return (
          <div key={i}>
            {JSON.stringify(feature.properties.bottom_line_summary)}
          </div>
        )
      }
    };

    return (
      <div className="flex-parent-inline flex-parent--center-cross flex-parent--column absolute bottom">
        <div className="flex-child px12 py12 bg-gray-dark color-white shadow-darken10 round" style={{"width" : "200px", 'background' : 'grey'}}>
          {features.map(renderFeature)}
        </div>
        <span className="flex-child color-gray-dark triangle triangle--d"></span>
      </div>
    );
  }
}