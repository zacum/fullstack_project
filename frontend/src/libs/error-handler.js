module.exports = errorHandler;

function errorHandler(actionAsync) {
  return function (data, thunkApi) {
    const { rejectWithValue } = thunkApi;
    return actionAsync(data, thunkApi).catch(error => {
      return rejectWithValue({
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
      });
    });
  };
}
