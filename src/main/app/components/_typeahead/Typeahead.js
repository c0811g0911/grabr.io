import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import {Spinner} from '../_spinner/Spinner';
import './_typeahead.scss';

class OptionList extends React.Component {
  static displayName = 'OptionList';

  static defaultProps = {
    options: []
  };

  renderOption(option, index) {
    return <li onMouseEnter={event => this.props.onChange(index)}
               onMouseDown={event => this.props.onClick(index)}
               key={option.id}
               className={classNames({active: index === this.props.index})}>
      {option.value}
    </li>;
  }

  renderOptions() {
    return this.props.options.map(this.renderOption.bind(this));
  }

  render() {
    if (!this.props.options.length) {
      return null;
    }

    return <ul className={this.props.className || ''}>
      {this.renderOptions()}
    </ul>;
  }

}

export class Typeahead extends React.Component {
  static displayName = 'Typeahead';

  static defaultProps = {
    options: [],
    query: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      index: null,
      query: props.query
    };
  }

  prev() {
    this.goto(!_.isNull(this.state.index) ? this.state.index - 1 : -Infinity);
  }

  next() {
    this.goto(!_.isNull(this.state.index) ? this.state.index + 1 : +Infinity);
  }

  goto(index) {
    if (!this.state.active) {
      return;
    }

    if (index > this.props.options.length - 1) {
      index = 0;
    }
    if (index < 0) {
      index = this.props.options.length - 1;
    }

    this.setState({index});
  }

  select(index = null) {
    if (index === null && this.state.index === null) {
      return;
    }

    const item = this.props.options[index || this.state.index];
    if (!item) {
      return;
    }

    this.refs.input.blur();

    this.setState({query: item.value});

    this.props.onValueChange({value: item.id, query: item.value, type: item.type});
  }

  removeSelection() {
    this.setState({query: ''});
    this.props.onValueRemove();
  }

  handleQueryChange(event) {
    const value = event.target.value;

    this.setState({active: true, query: value});
    this.props.onQueryChange(value);
  }

  handleFocus(event) {
    this.props.onFocus();

    this.setState({active: true});
  }

  handleBlur(event) {
    setTimeout(() => {
      this.setState({active: false, index: null});
    }, 100);
  }

  handleKeyDown(event) {
    switch (event.key) {

      case 'Enter':
        event.preventDefault();
        event.stopPropagation();
        this.select();
        break;

      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        this.prev();
        break;

      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        this.next();
        break;
    }
  }

  renderOptions() {
    return <OptionList className={classNames({active: this.state.active})}
                       onChange={this.goto.bind(this)}
                       onClick={this.select.bind(this)}
                       options={this.props.options}
                       index={this.state.index}/>;
  }

  renderRemoveButton() {
    if (!this.props.value) {
      return null;
    }

    return <button className="transparent" type="button" onClick={this.removeSelection.bind(this)}>
      <i className="icon icon--times-black"/>
    </button>;
  }

  renderSync() {
    if (!this.props.isSyncing) {
      return null;
    }

    return <Spinner />;
  }

  render() {
    const {className, placeholder} = this.props;
    const {active, query} = this.state;
    return <div className={classNames({
      'grabr-typeahead': true,
      [className]: !!className
    })}>
      <input ref="input"
             className={classNames({active})}
             value={query}
             onFocus={this.handleFocus.bind(this)}
             onBlur={this.handleBlur.bind(this)}
             onChange={this.handleQueryChange.bind(this)}
             onKeyDown={this.handleKeyDown.bind(this)}
             placeholder={placeholder}/>
      {this.renderSync()}
      {this.renderRemoveButton()}
      {this.renderOptions()}
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_typeahead/Typeahead.js