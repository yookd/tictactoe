export function contains(arr, item) {
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] === item) return true;
  }
  return false;
}

export function unique(arr) {
  let result = [];
  for(let i = 0; i < arr.length; i++) {
    if(!contains(result, arr[i])) {
      result.push(arr[i]);
    }
  }

  return result;
}