import { CoreShapes } from './core-shapes';

const allShapesSets = [
  CoreShapes
];

const allShapes: any = {};

for (const set of allShapesSets) {
  for (const shape in set) {
    if (set.hasOwnProperty(shape)) {
      allShapes[shape] = set[shape];
    }
  }
}

if (typeof window !== 'undefined' && window.hasOwnProperty('FeruiIcons')) {
  window.FeruiIcons.add(allShapes);
}

export { allShapes as AllShapes };
