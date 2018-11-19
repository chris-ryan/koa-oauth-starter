import fs from 'fs';

// takes an array of key value pairs (source and replacement strings) and applies it to the target file 
export function fileStringReplace(targetFile, replaceSet) {
  return new Promise((resolve, reject) => {
    fs.readFile(targetFile, 'utf8', function (err,data) {
      if (err) reject(err);
      else {
        for (let [origString, replacement] of replaceSet) {
          const regex = new RegExp(origString, 'g');
          data = data.replace(regex, replacement);
        }
        resolve(data);
      }
    });
  })
}