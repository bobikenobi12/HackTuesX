import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "./auth-api-slice";
import type { RootState } from "@/redux/store";
interface InitialState {
	_token: string;
	_refreshToken: string;
	_expires: number;
	id: number;
	email: string;
	name: string;
	followers: number;
	following: number;
}

const authState: InitialState = {
	_token: localStorage.getItem("token") || "",
	_refreshToken: localStorage.getItem("refreshToken") || "",
	_expires: 0,
	id: 0,
	email: "",
	name: "",
	followers: 0,
	following: 0,
};

export const authHandlerSlice = createSlice({
	name: "auth",
	initialState: authState,
	reducers: {
		setToken: (state, action) => {
			state._token = action.payload;
			localStorage.setItem("token", action.payload);
		},
		logOut: (state) => {
			state = authState;
			localStorage.clear();
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			authApiSlice.endpoints.login.matchFulfilled,
			(state, action) => {
				state._refreshToken = action.payload.refresh_token;
				state._token = action.payload.access_token;
				state._refreshToken = action.payload.refresh_token;
				state._expires = action.payload.expires_in;
				localStorage.setItem("token", action.payload.access_token);
				localStorage.setItem(
					"refreshToken",
					action.payload.refresh_token
				);
			}
		);
		builder.addMatcher(
			authApiSlice.endpoints.register.matchFulfilled,
			(state, action) => {
				state._token = action.payload.access_token;
				state._expires = action.payload.expires_in;
				state._refreshToken = action.payload.refresh_token;
				localStorage.setItem("token", action.payload.access_token);
				localStorage.setItem(
					"refreshToken",
					action.payload.refresh_token
				);
			}
		);
		builder.addMatcher(
			authApiSlice.endpoints.getUser.matchFulfilled,
			(state, action) => {
				state.id = action.payload.id;
				state.email = action.payload.email;
				state.name = action.payload.name;
				state.followers = action.payload.followers;
				state.following = action.payload.following;
			}
		);
	},
});

export const { setToken, logOut } = authHandlerSlice.actions;

export const selectToken = (state: RootState) => state.auth._token;

export default authHandlerSlice;
