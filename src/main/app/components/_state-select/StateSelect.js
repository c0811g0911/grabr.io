import React, {PropTypes} from 'react';
import _ from 'lodash';
import {connectToStores} from 'fluxible-addons-react';
import {AllCountriesStore} from '../../stores/SequenceStores';

export const StateSelect = connectToStores(class extends React.Component {
  static displayName = 'StateSelect';

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    country: PropTypes.string
  };

  getStates() {
    const country = _.find(this.props.countries, country => country.get('id') === this.props.country);

    if (!country) {
      return [];
    }
    return country.get('subdivisions');
  }

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  renderStateOptions() {
    return _.map(this.getStates(), value => {
      return <option key={value.code} value={value.code}>
        {value.name}
      </option>;
    });
  }

  render() {
    return (
      <div>
        <select
          defaultValue={this.getStates()[0]}
          value={this.props.value}
          onChange={this.handleChange.bind(this)}
        >
          {this.renderStateOptions()}
        </select>
      </div>
    );
  }
}, [AllCountriesStore], ({getStore}) => {
  return {
    countries: getStore(AllCountriesStore).get()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_state-select/StateSelect.js