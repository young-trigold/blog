import appStore from '@/app/appStore';
import { getUserInfo, resetUser } from '@/app/slices/user';
import { message } from '@/components/Message';

const watchedLocalStorage = {
  getItem<T>(key: string) {
    const valueAsStr = window.localStorage.getItem(key);
    if (valueAsStr != null) {
      const parsedValue = JSON.parse(valueAsStr) as T | null;
      return parsedValue;
    }
    return null;
  },
  setItem<T>(key: string, value: T) {
    if (value == null) return message.warn('尝试向本地储存写入空值');

    if (typeof value === 'object') {
      try {
        JSON.stringify(value);
      } catch (error) {
        return message.warn('尝试向本地储存写入不规范值');
      }
    }

    const stringifiedValue = JSON.stringify(value);

    window.localStorage.setItem(key, stringifiedValue);

    if (key === 'user') {
      appStore.dispatch(getUserInfo());
    }
  },
  removeItem(key: string) {
    window.localStorage.removeItem(key);
    if (key === 'user') {
      appStore.dispatch(resetUser());
    }
  },
};

export default watchedLocalStorage;
