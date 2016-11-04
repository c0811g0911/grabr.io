import React from 'react';
import {TagListEditor} from 'react-tag-list-editor';
import {FilteredList} from 'react-filtered-list';

const {func, array} = React.PropTypes;

export class AutocompleteTagListEditor extends React.Component {
  static displayName = 'AutocompleteTagListEditor';

  static propTypes = {
    onChange: func.isRequired,
    value: array.isRequired,
    suggestions: array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      filter: ''
    };
  }

  filterSuggestions = () => {
    const {value, suggestions} = this.props;

    return suggestions.filter(item => !value.find(tag => tag.id === item.id));
  };

  addTag = index => {
    const {onChange, value, suggestions} = this.props;

    onChange(value.concat(this.filterSuggestions()[index]));
  };

  deleteTag = (tag, index) => {
    const {onChange, value} = this.props;

    onChange([...value.slice(0, index), ...value.slice(index + 1)]);
  };

  filterList = value => {
    this.setState({filter: value});
  };

  render() {
    const {value, suggestions} = this.props;

    return <div>
      <TagListEditor tags={value}
                     onInputChange={this.filterList}
                     onTagDelete={this.deleteTag}
                     renderTag={tag => <span className="autocomplete-tag-list-item">
                {tag.title}
                       <span className="autocomplete-tag-list-item__delete"
                             onClick={() => this.deleteTag(tag, value.indexOf(tag))}>
                  x
                </span>
              </span>}/>
      <FilteredList values={this.filterSuggestions().map(item => item.title)}
                    filter={this.state.filter}
                    onSelectValue={this.addTag}
                    expandable={false}/>
    </div>;
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/autocomplete-tag-list-editor/AutocompleteTagListEditor.js