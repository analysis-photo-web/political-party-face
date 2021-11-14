/**
 * https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
 */
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

/**
 * https://romeoh.tistory.com/entry/javascript-UUID-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0
 */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

/**
 * https://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
 */
Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
            ].join('');
};

const makeUID = () => {
    var date = new Date();
    return `${uuid()}-${date.yyyymmdd()}`
}