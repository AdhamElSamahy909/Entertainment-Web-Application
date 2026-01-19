import { MovieTVSeries } from "../../types/models";
import { apiSlice } from "./apiSlice";
import { updateUser } from "./authSlice";
import { RootState } from "./store";

interface SearchArgs {
  category: string;
  search: string;
}

interface UpdateMovieArgs {
  id: string;
  body: Partial<MovieTVSeries>;
}

export const moviesTvSeriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMoviesTvSeries: builder.query<MovieTVSeries[], void>({
      query: () => ({
        url: "/moviesTVSeries",
        method: "GET",
        credentials: "include",
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("All Shows: ", data);
        } catch (error) {
          console.log("Error fetching all shows: ", error);
        }
      },

      providesTags: (result) => {
        console.log("Result of fetching all shows: ", result);

        return result
          ? [
              { type: "MoviesTVSeries", id: "LIST" },
              ...result.map((show) => ({
                type: "MoviesTVSeries" as const,
                id: show._id,
              })),
            ]
          : [{ type: "MoviesTVSeries", id: "LIST" }];
      },
    }),

    getMovieTVSeries: builder.query<MovieTVSeries, string>({
      query: (id) => ({
        url: `/moviesTVSeries/${id}`,
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Show: ", data);
        } catch (error) {
          console.log(error);
        }
      },

      providesTags: (_, __, id) => [{ type: "MoviesTVSeries", id }],
    }),

    updateMoviesTVSeries: builder.mutation<MovieTVSeries, UpdateMovieArgs>({
      query: ({ id, body }) => ({
        url: `/moviesTVSeries/${id}`,
        method: "POST",
        credentials: "include",
        body,
      }),

      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            // @ts-ignore
            "getMoviesTvSeries",
            undefined,
            (draft: MovieTVSeries[]) => {
              const show = draft.find((s) => s._id === id);
              if (show) {
                Object.assign(show, body);
              }
            }
          )
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            apiSlice.util.updateQueryData(
              // @ts-ignore
              "getMoviesTvSeries",
              undefined,
              (draft: MovieTVSeries[]) => {
                const index = draft.findIndex((s) => s._id === id);
                if (index !== -1) {
                  draft[index] = data;
                }
              }
            )
          );
        } catch {
          patchResult.undo();
          dispatch(
            apiSlice.util.invalidateTags([{ type: "MoviesTVSeries", id }])
          );
        }
      },
    }),

    search: builder.query<MovieTVSeries[], SearchArgs>({
      query: ({ category, search }) => {
        let type = "";
        switch (category) {
          case "tvseries":
            type = "TV Series";
            break;

          case "movies":
            type = "Movie";
            break;

          case "bookmarked":
            type = "isBookmarked";
            break;

          default:
            break;
        }

        return {
          url: "/moviesTVSeries/search",
          method: "GET",
          credentials: "include",
          params: {
            type,
            search,
          },
        };
      },

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Search: ", data);
        } catch (error) {
          console.log("Error fetching all shows: ", error);
        }
      },

      providesTags: (result) => {
        console.log("Search result: ", result);

        return result
          ? [
              { type: "MoviesTVSeries", id: "LIST" },
              ...result.map((show) => ({
                type: "MoviesTVSeries" as const,
                id: show._id,
              })),
            ]
          : [{ type: "MoviesTVSeries", id: "LIST" }];
      },
    }),

    getBookmarked: builder.query<MovieTVSeries[], void>({
      query: () => ({
        url: "/users/bookmarks",
        method: "GET",
        credentials: "include",
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },

      providesTags: (result) => {
        console.log("Result of getBookmarked: ", result);

        return result
          ? [
              { type: "MoviesTVSeries", id: "BOOKMARK_LIST" },
              ...result.map(({ _id: id }) => ({
                type: "MoviesTVSeries" as const,
                id,
              })),
            ]
          : [{ type: "MoviesTVSeries", id: "BOOKMARK_LIST" }];
      },
    }),

    removeBookmark: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/bookmarks/${id}`,
        method: "DELETE",
        credentials: "include",
      }),

      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const { user } = state.auth;

        if (!user) return;

        console.log("Old User: ", user);
        if (user) {
          const newUser = {
            ...user,
            bookmarks: user.bookmarks.filter((bookmarkId) => bookmarkId !== id),
          };

          console.log("New User: ", newUser);

          dispatch(updateUser(newUser));
        }

        const patchResult = dispatch(
          (apiSlice.util.updateQueryData as any)(
            "getBookmarked",
            undefined,
            (draft: MovieTVSeries[]) => {
              return draft.filter((show) => show._id !== id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          console.log("Error removing bookmark: ", error);
          dispatch(updateUser(user));
          patchResult.undo();
        }
      },

      invalidatesTags: (_, __, id) => {
        console.log("ID of removed bookmark: ", id);

        return [{ type: "MoviesTVSeries", id }];
      },
    }),

    addBookmark: builder.mutation<
      { message: string; newShow: MovieTVSeries },
      string
    >({
      query: (id) => ({
        url: `/users/bookmarks/${id}`,
        method: "POST",
        credentials: "include",
      }),

      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const { user } = state.auth;
        if (!user) return;

        console.log("Old User: ", user);

        const newUser = {
          ...user,
          bookmarks: [...user.bookmarks, id],
        };

        console.log("New User: ", newUser);

        dispatch(updateUser(newUser));

        try {
          const { data } = await queryFulfilled;

          const newShow = data.newShow;

          dispatch(
            (apiSlice.util.updateQueryData as any)(
              "getBookmarked",
              undefined,
              (draft: MovieTVSeries[]) => {
                const exists = draft.find((show) => show._id === newShow._id);
                if (!exists) {
                  draft.push(newShow);
                }
              }
            )
          );
        } catch (error) {
          console.log("Error during adding bookmark: ", error);
          if (user) dispatch(updateUser(user));
        }
      },

      invalidatesTags: (_, __, id) => {
        console.log("ID of bookmarked: ", id);

        return [{ type: "MoviesTVSeries", id }];
      },
    }),
  }),
});

export const {
  useGetMoviesTvSeriesQuery,
  useGetMovieTVSeriesQuery,
  useSearchQuery,
  useUpdateMoviesTVSeriesMutation,
  useGetBookmarkedQuery,
  useRemoveBookmarkMutation,
  useAddBookmarkMutation,
} = moviesTvSeriesApiSlice;
