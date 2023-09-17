import { useEffect } from "react";

function useStorage(store) {
  useEffect(() => {
    const savedState = localStorage.getItem("user");

    if (savedState) {
      store.setState(JSON.parse(savedState));
    }

    localStorage.setItem("user", JSON.stringify(state));
  }, [store]);

  return store;
}

export default useStorage;
