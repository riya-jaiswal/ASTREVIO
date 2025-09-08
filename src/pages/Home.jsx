
import Hero from '../sections/Hero'
import Services from '../sections/Servicesection'
import Steps from '../sections/Steps'
import FeaturedDesign from '../sections/FeaturedDesign'
import Testimonial from '../sections/Testimonial'
import Newsletter from '../sections/Newsletter'
import Mainlayout from '../layout/Mainlayout'

function Home() {
  return (
    <Mainlayout>
  
      <Hero />
      <Services />
      <Steps />
      <FeaturedDesign />
      
      <Testimonial />
      <Newsletter />
     
    </Mainlayout>
  )
}

export default Home
