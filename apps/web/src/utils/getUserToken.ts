const getUserToken = () => {
  const rawUser = localStorage.getItem('user');
  const user = rawUser && JSON.parse(rawUser);

  return user?.token;
};

export default getUserToken;
