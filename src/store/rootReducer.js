import { reducer as pingReducer } from './modules/ping'
import { reducer as navReducer } from './modules/nav'
import { reducer as indexReducer } from './modules/index'

const rootReducer = {
  ping: pingReducer,
  nav: navReducer,
  index: indexReducer
}

export default rootReducer
