import React from 'react';
import {Typeahead} from '../_typeahead/Typeahead';
import {connectToStores} from 'fluxible-addons-react';
import {loadCitiesSuggest, clearCitiesSuggest} from '../../actions/CitiesSuggest';
import {FromCitySuggest, ToCitySuggest} from '../../stores/SequenceStores';
import {AppStore} from '../../stores/AppStore';

const {any, array, bool, func, string, object} = React.PropTypes;

class CitiesSuggest extends React.Component {
  static displayName = 'CitiesSuggest';

  static propTypes = {
    sequenceName: string.isRequired,
    value: any,
    query: string,
    suggestions: array,
    placeholderKey: string,
    onValueChange: func.isRequired,
    onFocus: func,
    withCountries: bool
  };

  static defaultProps = {
    onFocus: () => undefined,
    onRemove: () => {
    },
    withCountries: false
  };

  static contextTypes = {
    executeAction: func.isRequired,
    getStore: func.isRequired,
    intl: object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(newProps) {
    this.setState(newProps);
  }

  handleValueChange(value) {
    this.setState({value});
    this.props.onValueChange(this.state.suggestions.filter(s => s.get('id') === value.value)[0]);
  }

  handleQueryChange(query) {
    this.setState({query, suggestions: [], value: null});

    if (this.queryTimeout) {
      clearTimeout(this.queryTimeout);
    }

    this.queryTimeout = setTimeout(() => {
      if (query.length > 2) {
        this.context.executeAction(loadCitiesSuggest, {
          sequenceName: this.props.sequenceName,
          term: query,
          withCountries: this.props.withCountries
        });
      } else {
        this.context.executeAction(clearCitiesSuggest, {
          sequenceName: this.props.sequenceName
        });
        this.props.onValueChange(null);
      }
    }, 500);
  }

  handleValueRemove() {
    this.setState({value: null, query: ''});
    this.props.onValueChange(null);
    this.props.onRemove();
    this.context.executeAction(clearCitiesSuggest, {
      sequenceName: this.props.sequenceName
    });
  }

  render() {
    return <Typeahead className={this.props.className}
                      query={this.state.query}
                      value={this.state.value}
                      placeholder={this.context.intl.formatMessage({id: this.props.placeholderKey})}
                      isSyncing={this.props.isSyncing}
                      options={this.state.suggestions.map(s => ({
                        id: s.get('id'),
                        type: s.get('type'),
                        value: s.getFullTitle()
                      }))}
                      onQueryChange={this.handleQueryChange.bind(this)}
                      onValueChange={this.handleValueChange.bind(this)}
                      onValueRemove={this.handleValueRemove.bind(this)}
                      onFocus={this.props.onFocus.bind(this)}/>;
  }
}
export const GrabFormTo = connectToStores(class extends React.Component {
  static displayName = 'GrabFormTo';

  render() {
    const {value, query, onChange, onRemove, placeholderKey} = this.props;

    return <CitiesSuggest {...this.props} value={value || null}
                          query={query || ''}
                          onValueChange={onChange}
                          onRemove={onRemove}
                          sequenceName={ToCitySuggest.sequenceName}
                          placeholderKey={placeholderKey || 'components.cities.grab_to'}/>;
  }
}, [ToCitySuggest], context => ({
  suggestions: context.getStore(ToCitySuggest).get(),
  isSyncing: context.getStore(ToCitySuggest).getInfo('isSyncing')
}));

export const GrabFormFrom = connectToStores(class extends React.Component {
  static displayName = 'GrabFormFrom';

  render() {
    const {value, query, onChange, onRemove, placeholderKey} = this.props;
    return <CitiesSuggest {...this.props} value={value || null}
                          query={query || ''}
                          onValueChange={onChange}
                          onRemove={onRemove}
                          withCountries={true}
                          sequenceName={FromCitySuggest.sequenceName}
                          placeholderKey={placeholderKey || 'components.cities.grab_from'}/>;
  }
}, [FromCitySuggest], context => ({
  suggestions: context.getStore(FromCitySuggest).get(),
  isSyncing: context.getStore(FromCitySuggest).getInfo('isSyncing')
}));



// WEBPACK FOOTER //
// ./src/main/app/components/_cities-suggest/CitiesSuggest.js