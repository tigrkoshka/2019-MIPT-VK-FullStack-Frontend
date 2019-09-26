/*
You are given a non-empty list of integers (X).

For this task, you should return a list consisting of
only the non-unique elements in this list.

To do so you will need to remove all unique elements
(elements which are contained in a given list only once).

When solving this task, do not change the order of the list.

Example:

input (array of integers): [1, 2, 3, 1, 3]
output (iterable of integers): [1, 3, 1, 3]

1 and 3 are non-unique elements.

More examples:

nonUniqueElements([1, 2, 3, 1, 3]) == [1, 3, 1, 3]
nonUniqueElements([1, 2, 3, 4, 5]) == []
nonUniqueElements([5, 5, 5, 5, 5]) == [5, 5, 5, 5, 5]
nonUniqueElements([10, 9, 10, 10, 9, 8]) == [10, 9, 10, 10, 9]
 */

export default function nonUniqueElements(data) {
  var repeats = [];
  var count = [];
  for (var i = 0; i < data.length; i++) {
    if (count[data[i]] == undefined) {
      count[data[i]] = 1;
    } else if (count[data[i]] == 1) {
      count[data[i]]++;
      repeats.push(data[i]);
    }
  }
  var res = [];
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < repeats.length; j++) {
      if (repeats[j] == data[i]) {
        res.push(data[i]);
      }
    }
  }
  return res;
}
