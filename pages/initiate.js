import React, { Component } from "react";
import {
  Form,
  Button,
  Icon,
  Message,
  Card,
  Segment,
  Divider,
} from "semantic-ui-react";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import Registration from "../ethereum/RegistrationCon";
import Layout from "./components/Layout";
import {Link,Router} from '../routes';
import { firebase, FieldValue } from './config'

class GPOcontracts extends Component {
  state = {
    errorMessage: "",
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
    loading5: false,
    add: [],
    routesNumber:[],
    contractName: [
      "Registration",
      "Purchase Negotiation",
      "Purchase Order",
      "Rebate Settlement",
      "Loyalty Rebate",
    ],
    routesFolder:[
      "/RContract/",
      "/PNContract/",
      "/POContract/",
      "/RebateContract/",
      "/LoyaltyContract/"
    ]
  };

  async componentDidMount() {
    try {
      const accounts = await web3.eth.getAccounts();
      const add1 = [];
      for (let i = 0; i < 5; i++) {
        const address = await factory.methods
          .deployedRegistrationContracts(accounts[0], i)
          .call();
        const emptyAddress = /^0x0+$/.test(address);
        if (!emptyAddress) add1.push(address);
      }

      this.setState({ add: add1 });
    } catch (err) {
      this.setState({
        errorMessage:
          "your metaMask account is not connected to this site, kindly connect",
      });
    }
    const result  = await this.getPOContracts();
    this.getRoutes(result);
  }

  async getPOContracts ()  {
    // console.log(this.state.add[0])
    const result = await firebase
          .firestore()
          .collection('Purchase_Negotiation')
          .where('parentRegID','==',this.state?.add[0])
          .get();
    // console.log("this is result",result.docs[0].data());
    return result.docs;
  }

  checkStatus = (docs,account) => {
    const res = docs.filter(doc => doc.data().manufacturerAdd == account)
    if(res.length > 0)
    return [0,1,3];
    else
    return [0,3];
  }

  getRoutes = async (result) => {
    const accounts = await web3.eth.getAccounts();
    const registration = Registration(this.state.add[0]).methods;
    const routes = await 
      registration.isGPO(accounts[0]).call() ? [
        0,1,4
      ] : registration.manufacturerExists(accounts[0]).call() ? 
          this.checkStatus(result,accounts[0])
        : registration.SPExists(accounts[0]).call() ? [
        0,2,
      ] : registration.distributorExists(accounts[0]).call() ? [
        2,3,
      ] : [];
      this.setState({ routesNumber: routes })
  }

  onRegistration = async (event) => {
    event.preventDefault();
    this.setState({ loading1: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createRegistration().send({
        from: accounts[0],
      });
      this.state.add.push(
        await factory.methods
          .deployedRegistrationContracts(accounts[0], 0)
          .call()
      );
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading1: false });
  };

  onPurchseNegotiation = async (event) => {
    event.preventDefault();
    this.setState({ loading2: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createPurchaseNegotiations().send({
        from: accounts[0],
      });
      this.state.add.push(
        await factory.methods
          .deployedRegistrationContracts(accounts[0], 1)
          .call()
      );
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading2: false });
  };

  onPurchseOrder = async (event) => {
    event.preventDefault();
    this.setState({ loading3: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createPurchaseOrders().send({
        from: accounts[0],
      });
      this.state.add.push(
        await factory.methods
          .deployedRegistrationContracts(accounts[0], 2)
          .call()
      );
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading3: false });
  };

  onRebateSettlement = async (event) => {
    event.preventDefault();
    this.setState({ loading4: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createRebatesSettelment().send({
        from: accounts[0],
      });
      this.state.add.push(
        await factory.methods
          .deployedRegistrationContracts(accounts[0], 3)
          .call()
      );
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading4: false });
  };

  onLoyaltyRebate = async (event) => {
    event.preventDefault();
    this.setState({ loading5: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createLoyaltyRebates().send({
        from: accounts[0],
      });
      this.state.add.push(
        await factory.methods
          .deployedRegistrationContracts(accounts[0], 4)
          .call()
      );
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading5: false });
  };

  details = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();

      const det1 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 0)
        .call();
      const det2 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 1)
        .call();
      const det3 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 2)
        .call();
      const det4 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 3)
        .call();
      const det5 = await factory.methods
        .deployedRegistrationContracts(accounts[0], 4)
        .call();

      console.log(det1, det2, det3, det4, det5);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  rederContracts() {
    const items = this.state.add.map((address,index) => {
        return {
          header: address,
          description: (
            <Link route={`${this.state.routesFolder[index]}${address}`}>
            <a>
              <i className="teal file alternate icon"></i>
              Visit {this.state.contractName[index]}
            </a>
            </Link>
          ),
          fluid: true,
        };
    }).filter((obj,index) => {
      return this.state.routesNumber.includes(index);
    })
    return <Card.Group items={items} />;
  }

  render() {
    const contracts = [
      {
        name: "Registration",
        functionCall: this.onRegistration,
        loading: this.state.loading1  
      },
      {
        name: "Purchase Negotiation",
        functionCall: this.onPurchseNegotiation,
        loading: this.state.loading2  
      },
      {
        name: "Purchase Order",
        functionCall: this.onPurchseOrder,
        loading: this.state.loading3  
      },
      {
        name: "Rebate Settlement",
        functionCall: this.onRebateSettlement,
        loading: this.state.loading4  
      },
      {
        name: "Loyalty Rebate",
        functionCall: this.onLoyaltyRebate,
        loading: this.state.loading5  
      }
    ];    
    return (
      <Layout>
        <Segment>
          <h3>Contract Creation</h3>
          <Form error={!!this.state.errorMessage}>
          {contracts.map((Obj,idx) => {
            if(this.state.routesNumber.includes(idx))
            return (
              <Button
                  loading={Obj.loading}
                  color="teal"
                  onClick={Obj.functionCall}
                >
                {Obj.name}
              </Button>
            )
          })}
          <Button
            primary
            onClick={this.details}
          >
            Show All Contracts
          </Button>
          <Message error header="Oops!" content={this.state.errorMessage} />
          </Form>
          <Divider section />

          <div>{this.rederContracts()}</div>
        </Segment>
      </Layout>
    );
  }
}
export default GPOcontracts;
