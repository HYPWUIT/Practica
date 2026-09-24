import { Outlet, ScrollRestoration } from 'react-router'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Toaster from '../components/Toaster'

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <ScrollRestoration />
    </div>
  )
}

export default RootLayout
