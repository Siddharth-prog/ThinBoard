import { Menu, Palette } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import SearchInput from "./SearchInput";

const Navbar = () => {
    const user = true;
    return (
        <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-ray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            <div className="md:flex max-w-7xl mx-auto hidden justify-between items-center gap-10 h-full">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Palette size={"28"} />
                    <h1 className="hidden md:block font-extrabold text-2xl whitespace-nowrap">Thinkboard</h1>
                </div>
                <div className="flex-1 min-w-0">
                    <SearchInput className="w-full" />
                </div>
                <div>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Settings
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Button variant='outline'>Login</Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex md:hidden items-center justify-between px-4 h-full">
                <h1 className="font-extrabold text-2xl">Thinkboard</h1>
                <MobileNavbar />
            </div>
        </div>
    );
};

export default Navbar;

const MobileNavbar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className="rounded-full bg-gray-100 hover:bg-gray-200" variant="outline">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle className="ml-2">Account</SheetTitle>
                </SheetHeader>
                <Separator className="mr-2" />
                <nav className="flex flex-col space-y-4" >
                    <span className="ml-6">Profile</span>
                    <span className="ml-6">Billing</span>
                    <span className="ml-6">Settings</span>
                </nav>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Log out</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}