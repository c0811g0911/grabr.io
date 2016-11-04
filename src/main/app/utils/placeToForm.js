export function placeToForm(place) {
  return place ? {value: place.get('id'), query: place.getFullTitle()} : null;
}



// WEBPACK FOOTER //
// ./src/main/app/utils/placeToForm.js