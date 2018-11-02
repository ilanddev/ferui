const writeSVGIcons = require('./write-svg-icons');
const shell = require('shelljs');

const SHAPE_SETS = [
  'core-shapes'
];

writeSVGIcons(SHAPE_SETS, () => {
  shell.exec('cd dist/ferui-icons/shapes; zip -r all-shapes.zip ./**/*');
  SHAPE_SETS.forEach(setName => {
    shell.exec(`cd dist/ferui-icons/shapes; zip -r ${setName}.zip ./${setName}/*; rm -r ./${setName}`);
  });
});
