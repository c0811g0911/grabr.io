// based on https://github.com/javierjulio/textarea-autosize

import React, {PropTypes} from 'react';
import './_autosizing-textarea.scss';

export class AutosizingTextarea extends React.Component {
  static displayName = 'AutosizingTextarea';

  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func
  };

  static defaultProps = {
    value: '',
    onChange: function () {
    },
    onBlur: function () {
    },
    onKeyDown: function () {
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  }

  componentDidMount() {
    this.element = this.refs.textarea;
    this.diff = parseInt(this.element.style.paddingBottom || 0) + parseInt(this.element.style.paddingTop || 0);

    if (this.hasText()) {
      element.style.height = this.element.scrollHeight - this.diff + 'px';
    }
  }

  hasText() {
    return this.state.value.replace(/\s/g, '').length > 0;
  }

  componentDidUpdate() {
    this.element.style.height = 0;
    this.element.style.height = this.element.scrollHeight - this.diff + 'px';
  }

  handleChange(event) {
    this.props.onChange(event.target.value);
    this.setState({value: event.target.value});

    this.element.style.height = 0;
    this.element.style.height = this.element.scrollHeight - this.diff + 'px';
  }

  handleBlur(event) {
    this.props.onBlur(event.target.value);
  }

  render() {
    return <textarea className="autosizing-textarea"
                     ref="textarea"
                     value={this.state.value}
                     onChange={this.handleChange.bind(this)}
                     onBlur={this.handleBlur.bind(this)}
                     onKeyDown={this.props.onKeyDown.bind(this)}
                     placeholder={this.props.placeholder}>
      </textarea>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_autosizing-textarea/AutosizingTextarea.js