import React from 'react';
import {cloneDeep} from 'lodash';

const {func, arrayOf, shape, string} = React.PropTypes;

const initialValue = {
  label: {
    ru: '',
    en: ''
  },
  placeholder: {
    ru: '',
    en: ''
  }
};

export class ItemPropertyListEditor extends React.Component {
  static displayName = 'ItemPropertyListEditor';

  static propTypes = {
    onChange: func.isRequired,
    value: arrayOf(shape({
      label: shape({
        en: string.isRequired,
        ru: string.isRequired
      }).isRequired,
      placeholder: shape({
        en: string.isRequired,
        ru: string.isRequired
      }).isRequired
    }))
  };

  state = {
    newValue: cloneDeep(initialValue)
  };

  update = (index, value, key) => {
    const {value: oldValue, onChange} = this.props;
    const updatedValue = cloneDeep(oldValue[index]);
    const keys = key.split('.');
    updatedValue[keys[0]][keys[1]] = value;

    onChange(oldValue.slice(0, index).concat(updatedValue).concat(oldValue.slice(index + 1)));
  };

  updateNewValue = (value, key) => {
    const updatedValue = cloneDeep(this.state.newValue);
    const keys = key.split('.');

    updatedValue[keys[0]][keys[1]] = value;
    this.setState({newValue: updatedValue});
  };

  delete = index => {
    const {value, onChange} = this.props;

    onChange(value.slice(0, index).concat(value.slice(index + 1)));
  };

  add = () => {
    const {value, onChange} = this.props;

    onChange(value.concat(this.state.newValue));
    this.setState({newValue: cloneDeep(initialValue)});
  };

  render() {
    const {value} = this.props;
    const {newValue} = this.state;

    return <div>
      {value.map((value, index) => <div key={index} className="m-b-2">
        <div className="flex-row">
          <label className="flex-grow">
            English label
            <input value={value.label.en} onChange={event => this.update(index, event.target.value, 'label.en')}/>
          </label>
          <label className="flex-grow">
            Russian label
            <input value={value.label.ru} onChange={event => this.update(index, event.target.value, 'label.ru')}/>
          </label>
        </div>
        <div className="flex-row">
          <label className="flex-grow">
            English placeholder
            <input value={value.placeholder.en}
                   onChange={event => this.update(index, event.target.value, 'placeholder.en')}/>
          </label>
          <label className="flex-grow">
            Russian placeholder
            <input value={value.placeholder.ru}
                   onChange={event => this.update(index, event.target.value, 'placeholder.ru')}/>
          </label>
        </div>
        <button className="btn btn-danger" type="button" onClick={() => this.delete(index)}>
          Delete
        </button>
      </div>)}
      <div>
        <div className="m-b-1">
          Add new property
        </div>
        <div className="flex-row">
          <label className="flex-grow">
            English label
            <input value={newValue.label.en} onChange={event => this.updateNewValue(event.target.value, 'label.en')}/>
          </label>
          <label className="flex-grow">
            Russian label
            <input value={newValue.label.ru} onChange={event => this.updateNewValue(event.target.value, 'label.ru')}/>
          </label>
        </div>
        <div className="flex-row">
          <label className="flex-grow">
            English placeholder
            <input value={newValue.placeholder.en}
                   onChange={event => this.updateNewValue(event.target.value, 'placeholder.en')}/>
          </label>
          <label className="flex-grow">
            Russian placeholder
            <input value={newValue.placeholder.ru}
                   onChange={event => this.updateNewValue(event.target.value, 'placeholder.ru')}/>
          </label>
        </div>
        <button className="btn btn-primary" type="button" onClick={this.add}>
          Add
        </button>
      </div>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/item-property-list-editor/ItemPropertyListEditor.js