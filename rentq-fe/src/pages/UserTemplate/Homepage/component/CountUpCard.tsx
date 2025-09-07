import { ReactNode } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

interface CountUpCardProps {
  title: string;
  end: number;
  duration?: number;
  icon: ReactNode;
}

const CountUpCard = ({ title, end, duration = 2, icon }: CountUpCardProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <div
      ref={ref}
      className="p-6 flex flex-col items-center text-center w-[48%] sm:w-[48%] md:w-[30%] xl:w-[22%] bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-5 mb-4 rounded-full text-3xl text-white bg-[#0A2E50] flex items-center justify-center w-16 h-16">
        {icon}
      </div>

      <p className="text-4xl md:text-5xl font-extrabold mt-2 mb-3 text-[#E07B39]">
        {inView ? <CountUp end={end} duration={duration} separator="," /> : 0}
      </p>

      <h3 className="text-[#0A2E50] text-md font-medium">{title}</h3>
    </div>
  );
};

export default CountUpCard;
