import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Mapbox from './components/Mapbox';
import GeoGrid from './components/GeoGrid';
import ViewToggle from './components/ViewToggle';
import InfoOverlay from './components/InfoOverlay';
import Legend from './components/Legend';

// needed for onTouchTap (can go away with react 1.0 release)
injectTapEventPlugin();

const App = () => (
  <div>
    <Mapbox />
    <GeoGrid />
    <InfoOverlay />
    <Legend />
    <ViewToggle />
  </div>
);

export default App;
