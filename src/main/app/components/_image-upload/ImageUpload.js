import React, {PropTypes} from 'react';
import {uploadImage, uploadImage2, removeImage, removeImage2} from '../../actions/ImageActionCreators';
import uuid from 'node-uuid';
import {Spinner} from '../_spinner/Spinner';
import './_image-upload.scss';

export class ImageInput extends React.Component {
  static displayName = 'ImageInput';

  static propTypes = {
    value: PropTypes.object,
    onImageChange: PropTypes.func,
    onImageRemove: PropTypes.func,
    asInput: PropTypes.bool
  };

  handleImageChange(event) {
    event.preventDefault();

    const file = event.target.files[0];

    this.props.onImageChange(file);
  }

  handleImageRemove(event) {
    event.preventDefault();
    event.stopPropagation();

    this.props.onImageRemove();
  }

  renderPlaceholder() {
    if (this.props.value) {
      return null;
    }

    return <div className="placeholder">
      <i className="icon--legacy-camera"/>
    </div>;
  }

  renderImage() {
    const {value} = this.props;

    if (!value) {
      return null;
    }

    const url = value.get ? value.get('url') : value.url;

    return <img src={url}/>;
  }

  renderInput() {
    if (!this.props.asInput) {
      return null;
    }
    if (!this.props.onImageChange) {
      return null;
    }

    return <input type="file" onChange={this.handleImageChange.bind(this)}/>;
  }

  renderSync() {
    if (!this.props.value || !this.props.value.isSyncing) {
      return null;
    }

    return <Spinner />;
  }

  renderRemoveButton() {
    if (!this.props.asInput) {
      return null;
    }
    if (!this.props.onImageRemove || !this.props.value) {
      return null;
    }

    return <button className="transparent icon--legacy-plus" onClick={this.handleImageRemove.bind(this)}>
    </button>;
  }

  render() {
    return <label className="grabr-image-input">
      {this.renderPlaceholder()}
      {this.renderSync()}
      {this.renderImage()}
      {this.renderInput()}
      {this.renderRemoveButton()}
    </label>;
  }
}

export class ImageUpload extends React.Component {
  static displayName = 'ImageUpload';

  static contextTypes = {
    executeAction: PropTypes.func.isRequired
  };

  static propTypes = {
    value: PropTypes.any,
    parentId: PropTypes.string,
    parentType: PropTypes.string,
    isMultiple: PropTypes.bool,
    maxNumber: PropTypes.number,
    onAdd: PropTypes.func,
    v2: PropTypes.bool,
    asInput: PropTypes.bool
  };

  static defaultProps = {
    isMultiple: false,
    maxNumber: null,
    onAdd: () => {
    },
    v2: false,
    asInput: true
  };

  // Handlers
  //
  handleImageChange(file) {
    this.props.onAdd();

    if (this.props.v2) {
      this.context.executeAction(uploadImage2, {
        file,
        multiple: this.props.isMultiple,
        property: this.props.property
      });
    } else {
      const id = uuid.v4();

      this.context.executeAction(uploadImage, {
        id,
        file,
        multiple: this.props.isMultiple,
        parent: {id: this.props.parentId, type: this.props.parentType},
        property: this.props.property
      });
    }
  }

  handleImageRemove(index) {
    if (this.props.v2) {
      this.context.executeAction(removeImage2, {index});
    } else {
      const value = this.props.value[index];
      this.context.executeAction(removeImage, {
        id: value.get ? value.get('id') : value.id,
        parent: {id: this.props.parentId, type: this.props.parentType}
      });
    }
  }

  renderImages() {
    return this.props.value.map((image, index) => {
      return <li key={index}>
        <ImageInput value={image}
                    asInput={this.props.asInput}
                    onImageRemove={this.handleImageRemove.bind(this, index)}/>
      </li>;
    });
  }

  renderAddInput() {
    if (!this.props.asInput) {
      return null;
    }
    if (this.props.maxNumber && this.props.value.length >= this.props.maxNumber) {
      return null;
    }

    return <li>
      <ImageInput asInput={this.props.asInput} onImageChange={this.handleImageChange.bind(this)}/>
    </li>;
  }

  render() {
    if (this.props.isMultiple) {
      return <ul className="grabr-image-upload">
        {this.renderImages()}
        {this.renderAddInput()}
      </ul>;
    } else {
      return <ImageInput value={this.props.value}
                         asInput={this.props.asInput}
                         onImageChange={this.handleImageChange.bind(this)}/>;
    }
  }
}



// WEBPACK FOOTER //
// ./src/main/app/components/_image-upload/ImageUpload.js