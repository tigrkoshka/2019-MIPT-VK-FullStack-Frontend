/*
 * Необходимо покрыть все возможные
 * и невозможные кейсы. Например,
 * convertBytesToHuman(-1) === false,
 * convertBytesToHuman(-1) !== '1 B',
 * convertBytesToHuman('string') === false
 * convertBytesToHuman(5) === '5 B'
 */

import convertBytesToHuman from './convertBytesToHuman';

test('Возвращает false для неправильного типа данных', () => {
  expect(convertBytesToHuman("abcd")).toBe(false);
  expect(convertBytesToHuman({})).toBe(false);
  expect(convertBytesToHuman(-1)).toBe(false);
  expect(convertBytesToHuman(true)).toBe(false);
});

test('Возвращает корректное значение для чисел', () => {
  expect(convertBytesToHuman(349)).toBe("349 B");
  expect(convertBytesToHuman(1024)).toBe("1 KB");
  expect(convertBytesToHuman(8574987393209)).toBe("7.8 TB");
  expect(convertBytesToHuman(827345732332)).toBe("770.53 GB");
  expect(convertBytesToHuman(1024 * 1024)).toBe("1 MB");
});
