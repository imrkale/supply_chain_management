import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import {Link} from "../routes";

class GPOIndex extends Component {
  state = {
    add: [],
  };
  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    const add1 = [];
    for (let i = 0; i < 5; i++) {
      add1.push(
        await factory.methods
          .deployedRegistrationContracts(accounts[0], i)
          .call()
      );
    }

    this.setState({ add: add1 });
  }

  render() {
    return <div>{this.state.add}</div>;
  }
}

export default GPOIndex;
