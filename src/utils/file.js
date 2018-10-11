import fs from 'fs';

export function fileStringReplace(targetFile, origString, replacement) {
  return new Promise((resolve, reject) => {
    fs.readFile(targetFile, 'utf8', function (err,data) {
      if (err) reject(err);
      else {
        const regex = new RegExp(origString, 'g');
        const result = data.replace(regex, replacement);
        resolve(result);
      }
    });
  })
}