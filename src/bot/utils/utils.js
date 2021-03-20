import fs from 'fs';

class Utils {
  /**
   *
   * @param {string} path
   * @param {string} data
   * @param {string} type - type of file - example: 'txt'
   * @param {string} method - 'write' or 'append'
   */
  static persistToDisk(path, data, type = 'txt', method = 'write') {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      if (method === 'write') {
        fs.writeFile(
          `${path}.${type}`,
          data,
          {
            flags: 'a',
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve('Success');
            }
          },
        );
      } else if (method === 'append') {
        fs.appendFile(
          `${path}.${type}`,
          data,
          {
            flags: 'a',
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve('Success');
            }
          },
        );
      }
    });
  }
}

export default Utils;
