import React from 'react';
import { useGetUserBoardsQuery } from '@/features/api/boardApi';
import { BoardList } from '@/components/dashboard/boardList';

const Dashboard = () => {
  const { data,isLoading, isError } = useGetUserBoardsQuery();
  
   return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Boards</h2>

      
      <BoardList/>
    </div>
  );
  
};

export default Dashboard;
