import { useEffect, useState } from 'react';

export const useIndexedDB = (storeName) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const request = indexedDB.open('CinemaDB', 1);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    request.onsuccess = event => {
      setDb(event.target.result);
    };
  }, [storeName]);

  const addItem = (item) => {
    const tx = db.transaction([storeName], 'readwrite');
    tx.objectStore(storeName).put(item);
    tx.oncomplete = () => console.log('Item saved');
  };

  const getItems = (callback) => {
    const tx = db.transaction([storeName], 'readonly');
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => callback(request.result);
  };

  return { addItem, getItems };
};