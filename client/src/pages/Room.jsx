
import Board from "@/components/board/Board";
// import ToolBar from "@/components/toolbar/Toolbar";
import Participants from "@/components/participants/RealParticipants";

import { useState } from "react";

const Room = () => {
  // const [hasJoinedRoom, setHasJoinedRoom] = useState(false);

  // if (!hasJoinedRoom) {
  //   return <NameInput onJoin={() => setHasJoinedRoom(true)} />;
  // }

  return (
    // <RoomContextProvider>
      <div className="relative h-full w-full overflow-auto pt-6 bg-yellow-100">

        <Participants />
        {/* <ToolBar /> */}
        <Board />
        {/* <Chat /> */}
      </div>
    // </RoomContextProvider>
  );
};

export default Room;
