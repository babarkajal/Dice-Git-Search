import React, { Component } from "react";
import RepoCard from "./RepoCard";

class Repositories extends Component {
  render() {
    const { list } = this.props;
    return (
      <React.Fragment>
        <div className="not-found">{this.props.dataStatus}</div>
        <div className="repo-list">
          {list &&
            list.map((val, index) => {
              console.log(val.watchers_count)
              return <RepoCard val={val} key={index} />;
            })}
        </div>
      </React.Fragment>
    );
  }
}

export default Repositories;
