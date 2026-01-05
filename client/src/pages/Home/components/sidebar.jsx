import React, { useState } from "react";
import Search from "./search";
import UserLists from "./userLists";

const Sidebar = () => {
  const [searchKey, setSearchKey] = useState("");

  return (
    <div className="ml-20 mt-5 w-full max-w-sm">
      {/* Search */}
      <Search searchKey={searchKey} setSearchKey={setSearchKey} />

      {/* User List */}
      <div className="mt-3">
        <UserLists searchKey={searchKey} />
      </div>
    </div>
  );
};

export default Sidebar;
