import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [sortType, setSortType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countriesPerPage, setCountriesPerPage] = useState(10); 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v2/all');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedCountry(null);
  };

  const sortedCountries = countries.sort((a, b) => {
    if (sortType === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortType === 'population_asc') {
      return a.population - b.population;
    } else if (sortType === 'population_desc') {
      return b.population - a.population;
    }
    return 0;
  });

  const filteredCountries = sortedCountries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * countriesPerPage;
  const endIndex = startIndex + countriesPerPage;
  const countriesToDisplay = filteredCountries.slice(startIndex, endIndex);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>React Country App</h1>
      </header>


      <input
        type="text"
        placeholder="Search by country name"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select onChange={(e) => setSortType(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="population_asc">Sort by Population (ASC)</option>
        <option value="population_desc">Sort by Population (DESC)</option>
      </select>

      <div className="pagination-controls">
        <label htmlFor="countriesPerPage">Countries Per Page:</label><br></br>
        <select
          id="countriesPerPage"
          onChange={(e) => setCountriesPerPage(Number(e.target.value))}
          value={countriesPerPage}
        >
          {[5, 6, 7, 8, 9, 10].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="content-container">
        <div className="country-list-container">
          <ul className="country-list">
            {countriesToDisplay.map((country) => (
              <li key={country.alpha3Code}>
                <button onClick={() => setSelectedCountry(country)}>
                  {country.name}
                  {country.flags && country.flags.svg && (
                    <img
                      src={country.flags.svg}
                      alt={`${country.name} Flag`}
                      className="country-flag-small"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="country-details-container">
          {selectedCountry && (
            <div className="country-details">
              <h1>{selectedCountry.name}</h1>
              <p>Flag: </p>
              {selectedCountry.flags && selectedCountry.flags.svg && (
                <div className="image-container">
                  <img
                    src={selectedCountry.flags.svg}
                    alt={`${selectedCountry.name} Flag`}
                    className="country-flag"
                  />
                </div>
              )}
              <p>Population: {selectedCountry.population || 'N/A'}</p>
              <p>Languages: {selectedCountry.languages ? selectedCountry.languages.map((lang) => lang.name).join(', ') : 'N/A'}</p>
              <p>Currency: {selectedCountry.currencies ? selectedCountry.currencies.map((curr) => curr.name).join(', ') : 'N/A'}</p>
              <p>Capital: {selectedCountry.capital || 'N/A'}</p>
              <p>Region: {selectedCountry.region || 'N/A'}</p>
              <p>Regional Bloc: {selectedCountry.regionalBlocs ? selectedCountry.regionalBlocs.map((bloc) => bloc.name).join(', ') : 'N/A'}</p>
              <button onClick={() => setSelectedCountry(null)}>Close</button>
            </div>
          )}
        </div>
      </div>

      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => handlePageChange(currentPage - 1)} className="prev-next">
            Previous
          </button>
        )}

        {Array.from({ length: Math.ceil(filteredCountries.length / countriesPerPage) }, (_, index) => {
          const page = index + 1;
          const isPageVisible = (
            (currentPage <= 3 && page <= 5) ||
            (currentPage > 3 && currentPage <= Math.ceil(filteredCountries.length / countriesPerPage) - 3 && Math.abs(currentPage - page) <= 2) ||
            (currentPage > Math.ceil(filteredCountries.length / countriesPerPage) - 3 && page >= Math.ceil(filteredCountries.length / countriesPerPage) - 4)
          );

          if (isPageVisible) {
            return (
              <button
                key={index + 1}
                className={currentPage === page ? 'active' : ''}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            );
          } else if (
            (currentPage <= 3 && page === 6) ||
            (currentPage > 3 && currentPage <= Math.ceil(filteredCountries.length / countriesPerPage) - 3 && Math.abs(currentPage - page) === 3)
          ) {
            return <span key={index} className="ellipsis">...</span>;
          }
          return null;
        })}

        {currentPage < Math.ceil(filteredCountries.length / countriesPerPage) && (
          <button onClick={() => handlePageChange(currentPage + 1)} className="prev-next">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
