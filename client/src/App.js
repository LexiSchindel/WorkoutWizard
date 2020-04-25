import React from 'react';
import NavBarMain from './NavBar';
import './App.css';

function App() {
  return (
    <div className="main-page">
      <div className="light-on-dark">
        <div className="section">
          <NavBarMain />
        </div>
        <div className="dark-on-light section">
        </div>
        <div className="dark-on-light section">
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}

export default App;