import Adapter from './src/adapter';
import Ruuvi from './src/ruuvi';

export default (manager, State) => new Ruuvi(new Adapter(manager, State));
