import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:8080/api/v1/board/';

export const boardApi = createApi({
  reducerPath: 'boardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include', // for cookies
  }),
  endpoints: (builder) => ({
    getUserBoards: builder.query({
      query: () => 'user',
    }),
    createBoard: builder.mutation({
      query: (boardData) => ({
        url: 'create',
        method: 'POST',
        body: boardData,
      }),
    }),
  }),
});

export const { useGetUserBoardsQuery, useCreateBoardMutation } = boardApi;
