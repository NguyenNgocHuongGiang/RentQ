import Blog from "./component/Blog";
import Carousel from "./component/Carousel";
import RentHouse from "./component/RentHouse";

export default function HomePage() {
  return (
    <>
      <Carousel />
      <RentHouse />
      <Blog />
    </>
  );
}
