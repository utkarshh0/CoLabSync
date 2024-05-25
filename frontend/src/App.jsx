import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

export default function App(){

  return(
    <>
      <div>
        <Toaster 
          position="top-right" 
          reverseOrder={true}
          toastOptions={{
            success: {
              iconTheme: {
                primary: '#E64833',
                secondary: 'white',
              },
            },
          }}/>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/editor/:id' element={<EditorPage  />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}