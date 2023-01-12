import { useState } from "react";
import { Octokit } from "@octokit/core";
import Repositories from "./Components/Repositories";
import Alert from "./Components/Alert";

function App() {
  //STATES FOR DATA
  const [repositories, setResult] = useState([]);
  const [searchString, setSearch] = useState(""); //search query
  const [filter, setFilter] = useState(""); //filter value
  const [searchApplied, setSearchStatus] = useState(null); //search is applied or not
  const [errorMessage, setErrorMessage] = useState(""); //error flag
  const [dataStatus, setDataStatus] = useState(""); //loading flag

  //IF THESE ARE TYPES OF FILTER THEN APPLY CUSTOM LOGIC
  const customFilter = () => {
    return (
      filter === "score" ||
      filter === "created_at" ||
      filter === "updated_at" ||
      filter === "watchers_count" ||
      filter === "name"
    );
  };

  const getRepoList = async () => {
    //IF SEARCH STRING IS NOT PRESENT
    if (!searchString || !searchString.trim()) {
      setErrorMessage("Please enter search query");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    //FETCH DATA
    const octokit = new Octokit({});
    let endPoint = "GET /search/repositories";
    let searchQueryParam = "";
    let filterQueryParam = "";

    //ADD QUERY PARAMETERS WHEN SEARCH STRING OR FILTER IS PRESENT
    if (searchString) {
      searchQueryParam = `?q=${searchString.toString().replace(/\s/, "+")}`;
    }

    if (filter && !customFilter() && filter !== "-1") {
      filterQueryParam = `&sort=${filter}`;
    }
    
    try {
      //MAKE REQUEST
      setDataStatus("Loading...");
      const response = await octokit.request(
        endPoint + searchQueryParam + filterQueryParam,
        {}
      );

      //IF WE GOT POSITIVE RESPONSE
      if (response && response.status === 200) {
        //when sorting keys are availed then make request if not then sort the received array
        if (!customFilter()) {
          setResult(response.data.items);
        } else {
          //CUSTOM SORT: SORT THE DATA BASED ON FILTER
          const data = response.data.items;
          if (data) {
            sortRepoList(data, filter);
          }
        }
        if (response.data.total_count) setDataStatus("");
        else setDataStatus("Searched data not found");

        setSearchStatus(true);
      } else {
        setDataStatus("");
        setErrorMessage(response.message);
      }
    } catch (e) {
      setErrorMessage("Some error Occurred");
      setTimeout(() => setErrorMessage(""), 5000);
      setDataStatus("");
    }
  };

  //CUSTOM SORT: SORT THE LIST BASED ON FILTER KEY
  const sortRepoList = (list, filter) => {

    if (filter === "name") {
      list.sort((r1, r2) => {
        return r1[`${filter}`]
          .toLowerCase()
          .localeCompare(r2[`${filter}`].toLowerCase());
      });
    } else if (filter === "updated_at" || filter === "created_at") {
      list.sort((r1, r2) => {
        return (
          new Date(r2[`${filter}`]).getTime() -
          new Date(r1[`${filter}`]).getTime()
        );
      });
    } else {
      list.sort((r1, r2) => {
        return r2[`${filter}`] - r1[`${filter}`];
      });
    }

    setResult([...list]);

    //!Bubble sort 
    // const tempList = [...list];
    // for (let i = 0; i < tempList.length-1; i++) {
    //   for (let j = 0; j < tempList.length - i - 1; j++) {
    //     console.log(tempList[j].watchers_count)
    //     if (tempList[j].watchers_count < tempList[j + 1].watchers_count) {
    //       let temp = tempList[j];
    //       tempList[j] = tempList[j + 1];
    //       tempList[j + 1] = temp;
    //     }
    //   }
    // }
    // return tempList;
  };


  //INPUT STRING HANDLER
  const handleInputString = (e) => {
    setSearch(e.target.value);
  };

  //FILTER STRING HANDLER
  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  //APPLY SEARCH FILTER
  const applySearchFilter = () => {
    getRepoList();
  };

  //*CLEAR FILTER AND SEARCH STATES
  const clearFilter = (e) => {
    setSearchStatus(false);
    setSearch("");
    setFilter("");
    setResult([]);
    setDataStatus("");
  };

  return (
    <div className="App">
      <h1 className="heading">Search Git repositories</h1>

      {/* SEARCH */}
      <div className="search">
        <input
          type="text"
          name=""
          id=""
          placeholder="Enter search string..."
          onChange={handleInputString}
          value={searchString}
        />
        <div className="sort">
          <select onChange={handleFilter} value={filter}>
            <option value="-1">Select sorting</option>
            <option value="stars">Stars</option>
            <option value="watchers_count">watchers count</option>
            <option value="score">score</option>
            <option value="name">name</option>
            <option value="created_at">created_at</option>
            <option value="updated_at">updated_at</option>
          </select>
        </div>
        <button onClick={applySearchFilter}>Apply</button>
      </div>

      {/* SHOW APPLIED FILTER */}
      {searchApplied && (
        <div className="applied-filters">
          {searchString && (
            <div className="applied-filters-value">
              Search String: <span>{searchString}</span>
            </div>
          )}
          {filter && filter !== "-1" && (
            <div className="applied-filters-value">
              Applied sort: <span>{filter}</span>
            </div>
          )}
          <button onClick={clearFilter}>Clear</button>
        </div>
      )}

      {/* SHOW LIST */}
      <Repositories list={repositories} dataStatus={dataStatus} />

      {/* SHOW ERROR ALERT */}
      {errorMessage && <Alert message={errorMessage} />}
    </div>
  );
}

export default App;
