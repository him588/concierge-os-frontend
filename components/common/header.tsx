import { useBaseContext } from "@/context/base-context";
import { Bell } from "lucide-react";
import { useEffect } from "react";

function Header() {
  const { userDetails } = useBaseContext();

  function initials(name: string) {
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("");
  }

  useEffect(() => {
    console.log(userDetails);
  }, [userDetails]);
  return (
    <div className="flex items-center justify-between gap-4 pb-6 mt-3">
      {/* Search */}
      <div className=""></div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Bell */}
        {/* <div className="relative w-12 h-12 bg-white border border-stone-100 rounded-full flex items-center justify-center text-stone-400 shadow-sm cursor-pointer hover:border-amber-100 hover:text-amber-500 transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-3 w-3 h-3 rounded-full bg-amber-400 border-2 border-white" />
        </div> */}

        {/* Divider */}
        <div className="w-px h-6 bg-stone-200" />

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="font-jakarta  font-medium text-stone-700 leading-none">
              {userDetails && userDetails.propertyName}
            </p>
            <p className="font-jakarta text-sm text-[10px] text-stone-400 mt-0.5">
              {userDetails && userDetails.name} | Admin
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl   bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-100 flex-shrink-0 font-playfair text-sm uppercase font-semibold">
            {userDetails &&
              userDetails.propertyName &&
              initials(userDetails.propertyName)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
