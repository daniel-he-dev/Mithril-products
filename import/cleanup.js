const path = require('path');
const fs = require('fs/promises');
const {createReadStream, createWriteStream, write} = require('fs');
const split2 = require('split2');


//Streamed version
let writeTo = createWriteStream(path.join(__dirname, '/import/products-clean.csv'));
let readFrom = createReadStream(path.join(__dirname, '/import/products.csv'), {
    encoding: 'utf8',
    highWaterMark: 64 * 1024,
});

//Text parser
function csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            // if (s && l === p) row[i] += l;
            row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret[0];
};

readFrom
    //Transform to line-by-line chunks
    .pipe(split2())
    //Clean data
    // .on('data', (line) => {
    //     line = line.split(',');
    //     line[3] = line[3][0] !== '\"' ? '\"' + line[3] : line[3];
    //     line[3] = line[3][line[3].length - 1] !== '\"' ? line[3] + '\"' : line[3];
    //     writeTo.write(line.join(',') + '\n')
    // })
    .on('data', (line) => {
        // line = line.split(',');
        line = csvToArray(line);
        line[5] = /\d/.test(line[5]) ? line[5].match(/\d+/) : line[5];
        writeTo.write(line.join(',') + '\n');
    })
    .on('error', (error) => console.log(error))
    .on('end', () => console.log('stream ending!'))

// fs.readFile(path.resolve(__dirname, './import/photos-test.csv'), 'utf-8')
//     .then(data => {
//         let lines = data.split('\n').map(line => line.split(','));
//         lines.forEach(line => {
//             if (line[3][0] !== '\"' ) {
//                 line[3] = '\"' + line[3];
//             }
//             if (line[3][line[3].length - 1] !== '\"') {
//                 line[3] = line[3] + '\"';
//             }
//         });
//         return lines.map(line => line.join(',')).join('\n');
//     })
//     .then(data => fs.writeFile(path.resolve(__dirname, './import/photos-test-clean.csv'), data, 'utf-8'))
//     .catch(err => console.log(err));

//Promise version
// fs.readFile(path.resolve(__dirname, './import/photos-test.csv'), 'utf-8')
//     .then(data => {
//         let lines = data.split('\n').map(line => line.split(','));
//         lines.forEach(line => {
//             if (line[3][0] !== '\"' ) {
//                 line[3] = '\"' + line[3];
//             }
//             if (line[3][line[3].length - 1] !== '\"') {
//                 line[3] = line[3] + '\"';
//             }
//         });
//         return lines.map(line => line.join(',')).join('\n');
//     })
//     .then(data => fs.writeFile(path.resolve(__dirname, './import/photos-test-clean.csv'), data, 'utf-8'))
//     .catch(err => console.log(err));

//Callback version
// fs.readFile(path.resolve(__dirname, './import/photos-test.csv'), 'utf-8', (err, data) => {
//     if (err) {
//         console.log('err: ', err);
//     } else {
//         let file = data.split('\n');
//         file = file.map(line => line.split(','));
//         file.forEach(line => {
//             if (line[3][0] !== '\"' ) {
//                 line[3] = '\"' + line[3];
//             }
//             if (line[3][line[3].length - 1] !== '\"') {
//                 line[3] = line[3] + '\"';
//             }
//         })
//         // console.table(file);
//     }
// });