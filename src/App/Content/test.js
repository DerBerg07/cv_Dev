let arr = [9999, 908, 928, 13, 399999999]
function a(arr) {
    let stepsCount = arr.length - 1;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < stepsCount; i += 1) {
            if (arr[i] > arr[i + 1]) {
                const temp = arr[i];
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
                swapped = true;
            }
        }
        stepsCount -= 1;
    } while (swapped);
    arr.reverse();
    return arr.join('');
}

function a2(arr){
    arr.sort((a, b)=>  +(b.toString()+a.toString()) - +(a.toString()+b.toString()))
    return arr.join('');
}

console.log(a(arr));
console.log(a2(arr));
console.log(a2(arr) - a(arr));

