import './App.css';
import { useState } from 'react';

function App() {
  const cats = [
    '/cat1.jpg',
    '/cat2.jpg',
    '/cat3.jpg',
  ];

  const [currentImage, setCurrentImage] = useState(cats[0]);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * cats.length);
    setCurrentImage(cats[randomIndex]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={currentImage} className="App-logo" alt="Random Cat" />
        <button onClick={getRandomImage}>Показать котят!</button>
      </header>
    </div>
  );
}


export default App;
