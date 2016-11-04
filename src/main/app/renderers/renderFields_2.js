import React from 'react';
import {Field} from '../components/_field_2/Field_2';
import _ from 'lodash';

export const renderFields = (formName, formSchema, {attributes, errors}) => {
  return _.compact(_.map(formSchema, (fieldSchema, name) => {
    if (_.isNull(fieldSchema)) {
      return null;
    }

    return <Field key={name}
                  name={name}
                  formName={formName}
                  attributes={attributes}
                  errors={errors} {...fieldSchema} />;
  }));
};



// WEBPACK FOOTER //
// ./src/main/app/renderers/renderFields_2.js