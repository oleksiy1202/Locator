import './App.css';
import Location from './assets/components/Location/Location';
import MapView from './assets/components/MapView/MapView';
import SystemInfo from './assets/components/SystemInfo/SystemInfo';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="App">
      {/* <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      </motion.h1> */}

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <SystemInfo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* <Location /> */}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {/* <MapView /> */}
      </motion.div>
    </div>
  );
}

export default App;
