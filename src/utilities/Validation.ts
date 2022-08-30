export const isRequired = {
  value: true,
  message: 'This field is require!',
};

export const isEmail = {
  value: /^([a-z0-9_-_+]+\.)*[a-z0-9_-_+]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i,
  message: 'Email is invalid!',
};
