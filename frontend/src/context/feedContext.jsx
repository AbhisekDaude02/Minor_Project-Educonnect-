import React, { createContext, useState } from "react";

export const FeedContext = createContext(null);

export const FeedProvider = ({ children }) => {
  const [myFeed, setMyFeed] = useState([]);

  return (
    <FeedContext.Provider
      value={{
        myFeed,
        setMyFeed,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};
