// toggle "ion-palette-dark" class on the html element
export const toggleIonDarkPalette = (shouldAdd: boolean) => {
  document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
};
