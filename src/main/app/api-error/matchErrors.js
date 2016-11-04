function match(errors, errorClass, errorType) {
  if (!errors) {
    return false;
  }
  const matchedByClassAndType = (errors[errorClass] || []).indexOf(errorType) !== -1;
  const matchedByClassOnly = Object.keys(errors[errorClass] || {}).length > 0;
  if (errorType === undefined) {
    return matchedByClassOnly;
  }
  return matchedByClassAndType;
}

export function matchErrors(errors) {
  return (errorClass, errorType) => match(errors, errorClass, errorType);
}

export function matchErrorsByClass(errors, errorClass) {
  return errorType => match(errors, errorClass, errorType);
}



// WEBPACK FOOTER //
// ./src/main/app/api-errors/matchErrors.js