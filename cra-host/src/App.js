import React, { lazy, Suspense } from 'react'; // Must be imported for webpack to work
import './App.css';

const Label = lazy(() => import('HeaderApp/Label'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading Header...</div>}>
        <Label text={'Anurag'} type={'h5'}/>
      </Suspense>
      <div className="container">Demo home page</div>
    </div>
  );
}

export default App;