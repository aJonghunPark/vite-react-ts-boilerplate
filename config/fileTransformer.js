import * as path from "path";

export default {
  process(src, filename, config, options) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`,
    };
  },
};
