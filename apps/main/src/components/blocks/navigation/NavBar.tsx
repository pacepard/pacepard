import { Bell } from 'lucide-react';
import TopNav from './top-nav';
import Trigger from './trigger';

// import UserAvatar from "./UserAvatar";
// import ThemeToggle from "@/components/shared/app/theme-toggle";

const NavBar = () => {
    return (
        <nav className="flex items-center justify-between p-4 h-14 w-full top-0 z-50 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
            {/* LEFT */}
            <div className="flex items-center ">
                <Trigger />
                <TopNav />
            </div>

            {/* RIGHT */}
            <div className="flex items-center cursor-pointer gap-2 justify-end">
                {/* <ThemeToggle/> */}
                <Bell className="h-5 w-5" />
                {/* <UserAvatar /> */}
            </div>
        </nav>
    );
};

// className="h-[84px] border-b flex justify-end items-center pr-[54px]
//       sticky top-0 z-40 bg-surface-page"
export default NavBar;
