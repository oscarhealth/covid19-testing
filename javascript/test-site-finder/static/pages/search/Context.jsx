import React, {createContext, useMemo, useState} from 'react';

const SearchResultsContext = createContext();

export const SearchResultsProvider = ({children}) => {
  const [results, setResults] = useState([]);
  const [resultId, setResultId] = useState();
  const [slotIndex, setSlotIndex] = useState();

  const value = useMemo(
    () => ({
      resultId,
      results,
      setResultId,
      setResults,
      setSlotIndex,
      slotIndex,
    }),
    [resultId, slotIndex, results]
  );

  return (
    <SearchResultsContext.Provider value={value}>
      {children}
    </SearchResultsContext.Provider>
  );
};

export const useSearchResults = () => React.useContext(SearchResultsContext);
