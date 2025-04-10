import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
            />
        </div>
    );
};

export default SearchInput;
