export const dateFormater = (inputDate: string | undefined): string | undefined => {
  return inputDate && inputDate.split('T')[0].split('-').join('.');
};
