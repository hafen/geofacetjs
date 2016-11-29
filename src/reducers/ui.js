import { WINDOW_RESIZE } from '../constants';

const windowHeight = typeof window === 'object' ? window.innerHeight : null;
const windowWidth = typeof window === 'object' ? window.innerWidth : null;


const gatesPalette = {
  primary: '#9B242D',
  secondary: [
    '#B6985E',
    '#8CB7C7',
    '#CE6B29',
    '#59452A',
    '#977C00',
    '#000000'
  ],
  tertiary: [
    '#F2EDDE',
    '#EAE2CD',
    '#AAA092',
    '#F1EFEC',
    '#E2EDF1',
    '#D5CB99'
  ],
  link: '#3086AB',
  text: '#392D1C'
};

const uiReducer = (state = { windowHeight, windowWidth }, action) => {
  switch (action.type) {
    case WINDOW_RESIZE:
      return Object.assign({}, state, {
        windowHeight: action.dims.height,
        windowWidth: action.dims.width
      });
    default:
  }
  return state;
};

export default uiReducer;
