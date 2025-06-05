import React from "react";
import { cn } from "@/lib/utils";

import devTeamImg from '@/assets/developer-team.png';

export const BoardCard = () => {


  return (
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-center overflow-hidden">
        <div className="relative flex-1 bg-amber-50 group">
        <img
            src={devTeamImg}
            alt="Image cover"
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity" />
        </div>

        <div className="relative bg-white p-3">
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">
        New Day
      </p>
      <p className="opacity-50 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        You, 2 days ago
      </p>
      <button
        disabled={false}
        onClick={() => {}}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-blue-600",
          false && "cursor-not-allowed opacity-75"
        )}
      >
      </button>
    </div>
    </div>
  );
};

