import * as React from 'react';
import { createRoot } from 'react-dom/client';

export const App = () => {
  return (
    <div>
      <h1>Hello, React!</h1>
    </div>
  );
};

const root = createRoot(document.getElementById('app'));
root.render(<App />);
