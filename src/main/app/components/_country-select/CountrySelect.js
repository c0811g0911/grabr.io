import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {loadCountries} from '../../actions/HelperActionCreators';
import _ from 'lodash';
import {AppStore} from '../../stores/AppStore';
import {AllCountriesStore, TravelerCountriesStore} from '../../stores/SequenceStores';
import './_country-select.scss';

export const CountrySelect = connectToStores(class extends React.Component {
  static displayName = 'CountrySelect';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
  };

  static propTypes = {
    traveler: PropTypes.bool,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    traveler: false
  };

  constructor(props) {
    super(props);

    this.state = {
      showEmptyOption: !props.value
    };
  }

  componentDidMount() {
    this.context.executeAction(loadCountries, {traveler: this.props.traveler});
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.value && this.props.value) {
      this.setState({showEmptyOption: false});
    }
  }

  handleChange(event) {
    this.props.onChange(event.target.value);
  }

  sortCountries(countries) {
    return _.sortBy(countries, function (country) {
      return country.get('alpha2') === 'US' ? 0 : 1;
    }, function (country) {
      return country.get('alpha2') === 'CA' ? 0 : 1;
    }, function (country) {
      return country.get('name');
    });
  }

  getCountries() {
    const countries = this.props.traveler ? this.props.travelerCountries : this.props.allCountries;

    return this.sortCountries(countries);
  }

  // Renderers
  //
  renderCountryOptions() {
    return this.getCountries().map(country => {
      return <option key={country.get('alpha2')} value={country.get('alpha2')}>
        {country.get('name')}
      </option>;
    });
  }

  render() {
    const countrySelectPlaceholder = this.context.intl.formatMessage({id: 'components.country_select.placeholder'});
    return <div>
      <select className="country-select" defaultValue={this.getCountries()[0]} {...this.props} onChange={this.handleChange.bind(this)}>
        {this.state.showEmptyOption && <option key="empty" value={""}>{countrySelectPlaceholder}</option>}
        {this.renderCountryOptions()}
      </select>
    </div>;
  }
}, [AllCountriesStore, TravelerCountriesStore], ({getStore}) => {
  return {
    allCountries: getStore(AllCountriesStore).get(),
    travelerCountries: getStore(TravelerCountriesStore).get()
  };
});



// WEBPACK FOOTER //
// ./src/main/app/components/_country-select/CountrySelect.js