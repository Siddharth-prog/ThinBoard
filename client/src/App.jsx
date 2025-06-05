import { createBrowserRouter } from 'react-router-dom';
import './App.css'
import Login from './pages/login'
import { RouterProvider } from 'react-router';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';

import Board from './pages/Room';

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
      path: "dashboard",
      element:<Dashboard/>
    },
    {
      path:"login",
      element:<Login/>
    },
  ],
},
{
  path:"board",
  element:<Board/>
},
]);

function App() {

  return (
    <main className="h-full">
      <RouterProvider router={appRouter} />
    </main>
  )
}

export default App;
