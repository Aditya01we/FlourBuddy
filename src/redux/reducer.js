import {Alert} from 'react-native';
import {AsyncStorageSetUser, AsyncStorageSettoken} from '../backend/Api';
const data = {
  user: {},
  coords: {},
  token: '',
  ftoken: '',
  live: {},
  male: {},
  female: {},
  location: {},
  netinfo: '',
  language: '',
};
const reducer = (state = data, action) => {
  switch (action.type) {
    case 'netinfo':
      return {
        ...state,
        netInfo: action.paylod,
      };
    case 'language':
      return {
        ...state,
        language: action.paylod,
      };
    case 'login':
      return {
        ...state,
        user: action.paylod,
      };
    case 'token':
      return {
        ...state,
        token: action.paylod,
      };
    case 'live':
      return {
        ...state,
        live: action.paylod,
      };
    case 'ftoken':
      return {
        ...state,
        ftoken: action.paylod,
      };
    case 'location':
      return {
        ...state,
        location: action.paylod,
      };
    case 'male':
      return {
        ...state,
        male: action.paylod,
      };
    case 'female':
      return {
        ...state,
        female: action.paylod,
      };
    case 'logout':
      AsyncStorageSetUser({});
      AsyncStorageSettoken('');
      return {
        ...state,
        user: {},
        token: '',
      };
    case 'setCoords':
      return {
        ...state,
        coords: action.payload,
      };
    case 'setLocation':
      return {
        ...state,
        location: action.payload,
      };
    // case 'init':
    //     return {
    //         ...state,
    //         created: action.payload.created,
    //         shared_with_me: action.payload.shared_with_me
    //     }
    // case 'modeChange':
    //     window.localStorage.setItem('amsMode', action.payload.mode)
    //     return {
    //         ...state,
    //         mode: action.payload.mode,
    //         program: {}
    //     }
    // case 'onCodeChange':
    //     return {
    //         ...state,
    //         code: action.payload
    //     }

    // case 'openProject':
    //     return {
    //         ...state,
    //         type: action.payload.type,
    //         program: action.payload.program

    //     }
    // case 'newProject':
    //     return {
    //         ...state,
    //         program: action.payload,
    //         created: [...state.created, action.payload]
    //     }
    // case 'updateProject':
    //     return {
    //         ...state,
    //         program: { ...state.program, file_name: action.payload.fileName, code: action.payload.code },
    //         created: state.created.map(obj => obj.program_id !== action.payload.id ? obj : { ...obj, file_name: action.payload.fileName, code: action.payload.code })
    //     }
    // case 'deleteProject':
    //     return {
    //         ...state,
    //         created: state.created.filter(obj => obj.program_id !== action.payload)
    //     }
    // case 'shareCourse':
    //     return {
    //         ...state,
    //         shareCourse: action.payload
    //     }
    default:
      return state;
  }
};

export default reducer;
