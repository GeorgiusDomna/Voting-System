import { IDepartmentData } from '@/interfaces/DepartmentResponseDto';
import documentData from '@/interfaces/IdocumentData';
import IUserInfo from '@/interfaces/userInfo';

/**
 * Создает двухуровневый массив из входного массива, разбивая его на подмассивы заданного размера.
 *
 * @param {IDepartmentData[] | documentData[] | IUserInfo[]} inputArray - Исходный массив чисел.
 * @param {number} [chunkSize=10] - Размер подмассива (количество элементов в каждом внутреннем массиве, по умолчанию устанавливается 10).
 * @returns {IDepartmentData[][] | documentData[][]| IUserInfo[][]} Двухуровневый массив, в котором каждый внутренний массив содержит не более chunkSize элементов.
 *
 * @example
 * const inputArray = [1, 2, 3, 4, 5, 6, 7, 8];
 * const result = createTwoLevelArr(inputArray, 3);
 * // result: [[1, 2, 3], [4, 5, 6], [7, 8]]
 */
export const createTwoLevelArr = (
  inputArray: IDepartmentData[] | documentData[] | IUserInfo[],
  chunkSize: number = 10
): IDepartmentData[][] | documentData[][]| IUserInfo[][] => {
  return Array.from({ length: Math.ceil(inputArray.length / chunkSize) }, (_, index) =>
    inputArray.slice(index * chunkSize, index * chunkSize + chunkSize)
  );
};
