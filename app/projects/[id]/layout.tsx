import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ProjectLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
