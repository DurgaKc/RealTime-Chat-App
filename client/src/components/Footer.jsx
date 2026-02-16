import { Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer className="bg-[#EFE9E3] text-gray-100 py-4 w-full mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 gap-2">

        {/* Left Side */}
        <Typography
          variant="body2"
          className="text-black text-center sm:text-left"
        >
          © {new Date().getFullYear()} QUICKCHAT APP. All Rights Reserved.
        </Typography>

        {/* Right Side */}
        <p className="text-black text-center sm:text-right">
          Developed & Managed by{" "}
          <a
            href="https://www.linkedin.com/in/durga-khanal/"
            className="text-[#3B82F6] font-semibold hover:underline"
          >
            @DurgaKhanal
          </a>
        </p>

      </div>
    </footer>
  );
}
