import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/postDetail/testID">DÒetailPage</Link>
            </li>
            <li>
              <Link to="/postInsert">NotFound</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};
