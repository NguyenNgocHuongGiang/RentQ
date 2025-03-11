import { useEffect } from "react";
import Blog from "./component/Blog";
import Carousel from "./component/Carousel";
import RentHouse from "./component/RentHouse";

// const FacebookPage = () => {
//   useEffect(() => {
//     if (typeof window !== "undefined" && !document.getElementById("facebook-jssdk")) {
//       const script = document.createElement("script");
//       script.id = "facebook-jssdk";
//       script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0";
//       script.async = true;
//       script.defer = true;
//       document.body.appendChild(script);
//     }
//   }, []);

//   return (
//     <div className="fb-page"
//       data-href="https://www.facebook.com/cgv.vn"  // Thay bằng Fanpage của bạn
//       data-tabs="timeline"
//       data-width="500"
//       data-height="600"
//       data-small-header="false"
//       data-adapt-container-width="true"
//       data-hide-cover="false"
//       data-show-facepile="true">
//     </div>
//   );
// };

export default function HomePage() {
  return (
    <>
      <Carousel />
      <RentHouse />
      <Blog />
    </>
  );
}
