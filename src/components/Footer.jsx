import {
  Linkedin,
  Github,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#4F46E5] px-8 py-8 md:py-14 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <span className="font-medium text-white">Get in touch</span>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-[#F59E42] text-white">
            <Linkedin size={24} />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href="#" className="hover:text-[#F59E42] text-white">
            <Github size={24} />
            <span className="sr-only">GitHub</span>
          </a>
          <a href="#" className="hover:text-[#F59E42] text-white">
            <Mail size={24} />
            <span className="sr-only">Email</span>
          </a>
        </div>
      </div>
      <a href="/" className="hover:text-[#F59E42] text-white font-medium underline">
        Home page
      </a>
    </footer>
  );
}
