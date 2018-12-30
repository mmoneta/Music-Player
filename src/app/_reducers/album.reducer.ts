export const AlbumReducer = (state: any = [], { type, payload }) => {
  switch (type) {
    case 'ADD_TRACK':
      return payload;
    case 'CREATE_TRACK':
      return [...state, payload];
    case 'UPDATE_TRACK':
      return state.map(track => {
        return track.token === payload.token ? Object.assign({}, track, payload) : track;
      });
    case 'DELETE_TRACK':
      return state.filter(track => {
        return track.token !== payload.token;
      });
    case 'CLEAR_ALBUM':
      return [];
    default:
      return state;
  }
};
