import React from 'react';
import './App.css';

import Layout from './Layout/Layout';
import VotingBooth from './Containers/VotingBooth/VotingBooth';

function App() {
  return (
    <div className="App">
      <Layout>
        <VotingBooth />
      </Layout>
    </div>
  );
}

export default App;
