import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MainContainer from './components/MainContainer';
import CreateContainer from './components/CreateContainer';
import CheckOutSuccess from './components/CheckOutSuccess';
import Orders from './pages/Orders';

function App() {
  return (
    <div className="w-screen h-auto flex flex-col bg-primary">
        <Header />

        <main className='mt-14 md:mt-20 px-4 md:px-16 py-4 w-full'>
            <Routes>
                <Route path='/*' element={<MainContainer />} />
                <Route path='/createItem' element={<CreateContainer />}/>
                <Route path='/checkout-success' element={<CheckOutSuccess/>} />
                <Route path='/orders/:id' element={<Orders/>}/>
            </Routes>
        </main>
    </div>
  );
}

export default App;
