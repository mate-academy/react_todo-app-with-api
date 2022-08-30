import { RootState } from '..';

export const selectIsAuthorization = (state: RootState) => state.auth.isAuthorization;
