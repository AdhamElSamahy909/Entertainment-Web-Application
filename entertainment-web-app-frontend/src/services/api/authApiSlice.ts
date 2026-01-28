import { AuthResponse, SignupRequest, LoginRequest } from "../../types/auth";
import { MovieTVSeries } from "../../types/models";
import { apiSlice } from "./apiSlice";
import { logout, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (Builder) => ({
    signup: Builder.mutation<AuthResponse, SignupRequest>({
      query: (credentials) => ({
        url: "/users/signup",
        method: "POST",
        body: { ...credentials },
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log("Data returned From signup: ", data);
          dispatch(setCredentials(data));
        } catch (error) {
          console.log("Error from signing up:, ", error);
        }
      },

      invalidatesTags: [
        "Auth",
        { type: "MoviesTVSeries", id: "BOOKMARK_LIST" },
      ],
    }),

    login: Builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        credentials: "include",
        body: { ...credentials },
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log("Data from logging in: ", data);
          dispatch(setCredentials({ user: data.user }));
        } catch (error) {
          console.log("Error from logging in: ", error);
        }
      },

      invalidatesTags: [
        "Auth",
        { type: "MoviesTVSeries", id: "BOOKMARK_LIST" },
      ],
    }),

    logout: Builder.mutation<void, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Data from logging out: ", data);
          dispatch(logout());
          dispatch(
            (apiSlice.util.updateQueryData as any)(
              "getBookmarked",
              undefined,
              (draft: MovieTVSeries[]) => {
                draft.splice(0, draft.length);
              },
            ),
          );
        } catch (error) {
          console.log("Error from logging out: ", error);
        }
      },
    }),

    refresh: Builder.query<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Data from refreshing request: ", data);
          dispatch(setCredentials(data));
        } catch (error) {
          console.log("Error from refreshing request: ", error);
        }
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshQuery,
} = authApiSlice;
