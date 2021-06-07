import {ACTION_SET_LOADING_STATE} from 'constants/constants';
export default ActionSetLoadingState = (content) => ({
  type: ACTION_SET_LOADING_STATE,
  payload: content,
});
