export const dateFormater = (inputDate: string): string => {
  return inputDate.split('T')[0].split('-').join('.');
};
