import { Outlet, ScrollRestoration } from 'react-router'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}

export default RootLayout
