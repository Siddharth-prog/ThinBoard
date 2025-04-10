import { createBrowserRouter } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import { Button } from './components/ui/button'
import Login from './pages/login'
import { RouterProvider } from 'react-router';
import MainLayout from './layout/MainLayout';

const appRouter = createBrowserRouter([
  {
  path:"/",
  element:<MainLayout/>,
  children:[
    {
      path:"/",
      element:
      (<>
        {/*create,join room,prev boards*/}
      </>)
    },
    {
      path:"login",
      element:<Login/>
    }
  ],
},
]);

function App() {

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  )
}

export default App;
