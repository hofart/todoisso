import View from './src/js/view.js';
import filterTypes from './src/data/filterTypes.js';
import { months, days } from './src/data/dates.js';

const view = new View({ filterTypes, months, days })
view._init()