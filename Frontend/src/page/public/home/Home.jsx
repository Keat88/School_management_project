import HeroSection from "./HeroSection";
import StatsBar from "./StatsBar";
import TestimonialsSection from "./TestimonialsSection";
import WhyChooseUsSection from "./WhyChooseUsSection";

const Home = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <HeroSection />
      <StatsBar />
      <TestimonialsSection />
      <WhyChooseUsSection />
    </div>
  );
};

export default Home;