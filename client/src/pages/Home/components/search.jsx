import { FaSearch } from "react-icons/fa";
import { TextField } from "@mui/material";

const Search = ({searchKey, setSearchKey}) => {
  return (
    <div className="flex items-center bg-[#F5F1ED]  px-3 py-1 mt-5 ml-2  rounded-full border border-gray-300 w-full max-w-sm focus-within:border-black transition">
      
      {/* Search Input */}
      <TextField
        variant="standard"
        placeholder="Search"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        InputProps={{
          disableUnderline: true,
        }}
        className="flex-1 text-sm "
      />

      {/* Search Icon Right */}
      <FaSearch className="text-black text-lg cursor-pointer ml-2 " />
    </div>
  );
};

export default Search;
