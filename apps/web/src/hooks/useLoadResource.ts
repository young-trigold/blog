import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { message } from '../components/Message';

const useLoadResource = <T>(url = '', dependencyList: React.DependencyList = []) => {
  const [resource, setResource] = useState<T | undefined>(undefined);

  const fetchData = async () => {
    try {
      const res = await axios.get(url);
      setResource(res.data);
    } catch (error) {
      if (axios.isAxiosError(error))
        return message.error((error.response?.data as { message: string })?.message);
      if (error instanceof Error) return message.error(error.message);
      return message.error(JSON.stringify(error));
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencyList);

  return { resource, setResource };
};

export default useLoadResource;
