const isMacPlatform = () =>
  typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

export default isMacPlatform;
