export default function Footer() {
  return (
    <footer className="bg-[#F0F2F5] shadow-sm">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#0A2E50]">
              RentQ
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-[#0A2E50] sm:mb-0">
            <li>
              <a href="#" className="hover:text-[#E07B39] me-4 md:me-6 transition-colors duration-200">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E07B39] me-4 md:me-6 transition-colors duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E07B39] me-4 md:me-6 transition-colors duration-200">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#E07B39] transition-colors duration-200">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-300 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-[#0A2E50] sm:text-center">
          © 2025{" "}
          <a href="/" className="hover:text-[#E07B39] transition-colors duration-200">
            RentQ
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
