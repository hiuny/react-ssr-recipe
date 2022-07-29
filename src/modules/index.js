const { combineReducers } = require("redux");
const { default: users } = require("./users");

const rootReducer = combineReducers({ users })
export default rootReducer