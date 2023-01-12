import React from "react";


//REUSABLE COMPONENT FOR REPOSITORY CARD
function RepoCard(props) {
  const { val } = props;
  return (
    <div className="repo-list-card" key={props.key}>
      <div className="avatar">
        <img src={val.owner.avatar_url} alt={val} />
      </div>
      <div className="name">{val.name}</div>
      <div className="desc">{val.description}</div>
      <div className="lang">
        Language: {val.language ? <span>{val.language}</span> : "--"}
      </div>
      <div className="lang">
        Stars: <span>{val.stargazers_count}</span>
      </div>
    </div>
  );
}

export default RepoCard;
