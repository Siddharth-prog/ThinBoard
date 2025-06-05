import React from 'react';
import { UserAvatar } from './UserAvatar';
// import { useRoom } from '@/common/recoil/room';
 

const Participants = () => {
    //   const { users } = useRoom();

    return (
        <div className="z-30 absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
            <div className="flex gap-x-2">
                {/* {[...users.keys()].map((userId, index) => {
        const user = users.get(userId); */}

                return (
                {/* <div
            key={userId}
            className="flex h-5 w-5 select-none items-center justify-center rounded-full text-xs text-white md:h-8 md:w-8 md:text-base lg:h-12 lg:w-12"
            style={{
              backgroundColor: user?.color || 'black',
              marginLeft: index !== 0 ? '-0.5rem' : 0,
            }}
          >
            {user?.name?.[0] || 'A'}
          </div> */}
                <UserAvatar
                    borderColor="black"
                    key="12345"
                    src="https://via.placeholder.com/150"
                    name="John Doe"
                    fallback="J"
                />
                <UserAvatar
                    borderColor="blue"
                    key="12346"
                    src="https://via.placeholder.com/150"
                    name="John Doe"
                    fallback="J"
                />
                <UserAvatar
                    borderColor="red"
                    key="12347"
                    src="https://via.placeholder.com/150"
                    name="John Doe"
                    fallback="J"
                />
                );
                {/* })} */}
            </div>
        </div>
    );
};

export default Participants;
