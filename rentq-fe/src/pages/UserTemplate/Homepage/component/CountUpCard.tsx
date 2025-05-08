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
      className="p-6 flex flex-col items-center text-center w-[48%] sm:w-[48%] md:w-[30%] xl:w-[22%]"
    >
      <div className="p-4 mb-2 rounded-full text-3xl text-white bg-linear-65 from-[#483507] to-[#a6892b]">
        {icon}
      </div>

      <p className="text-5xl font-extrabold mt-2 mb-5 bg-gradient-to-r from-[#483507] to-[#a6892b] bg-clip-text text-transparent">
        {inView ? <CountUp end={end} duration={duration} separator="," /> : 0}
      </p>

      <h3 className="text-[#483507] text-md font-medium ml-2">{title}</h3>
    </div>
  );
};

export default CountUpCard;
