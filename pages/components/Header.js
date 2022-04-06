import React from "react";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "../../routes";

const Header = () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">
          <i className="home icon"></i>Home
        </a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/initiate">
          <a className="item">
            <i className="file alternate outline icon"></i>
            Contracts
          </a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
