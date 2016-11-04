import React from 'react';
import {Field} from '../components/_field/Field';
import _ from 'lodash';

const createChangeAttribute = onChange => {
  return function (name, value) {
    let state = Object.assign(this.state.attributes, {[name]: value});

    if (onChange) {
      state = onChange(state, name, value);
    }

    this.setState(state);
  };
};

export const renderFields = (formName, formSchema, {messages = {}, component, validator, onChange}) => {
  return _.compact(_.map(formSchema, (fieldSchema, name) => {
    if (_.isNull(fieldSchema)) {
      return null;
    }

    return <Field key={name}
                  validator={validator}
                  name={name}
                  formName={formName}
                  attributes={component.state.attributes}
                  messages={messages[name]}
                  errors={component.state.errors}
                  changeAttribute={createChangeAttribute(onChange).bind(component)} {...fieldSchema} />;
  }));
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/renderFields.js