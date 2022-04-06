import React, { Component } from "react";
import { Form, Button, Input,Message,Segment,Divider } from "semantic-ui-react";
import Layout from "../components/Layout";
import RegistrationCon from "../../ethereum/RegistrationCon";
import web3 from "../../ethereum/web3";
import {Router} from '../../routes';

class Registration extends Component {
  state = {
    manufacturerFees: "",
    distributorAdd: "",
    providerFees: "",
    loading1: false,
    loading2: false,
    loading3: false,

    errorMessage1:"",
    errorMessage2:"",
    errorMessage3:"",

  };

  static async getInitialProps(props)
  {
    const {address} = props.query;
    return {address};

  }

  onSubmitManufacturer = async (event) => {
    event.preventDefault();
    this.setState({ loading1: true });
    try {
        console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const registration=RegistrationCon(this.props.address);
      await registration.methods.registerManufacturer().send({
        from: accounts[0],
        value:this.state.manufacturerFees
      });
    } catch (err) {
      this.setState({ errorMessage1: err.message});
    }
    this.setState({ loading1: false });
  };

  onSubmitDistributor = async (event) => {
    event.preventDefault();
    this.setState({ loading2: true });
    try {
        console.log("i am here");
        const registration=RegistrationCon(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await registration.methods.registerDistributor(this.state.distributorAdd).send({
        from: accounts[0]
      });
    } catch (err) {
      this.setState({ errorMessage2: err.message });
    }
    this.setState({ loading2: false });
  };

  onSubmitProvider = async (event) => {
    event.preventDefault();
    this.setState({ loading3: true });
    try {
        console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const registration=RegistrationCon(this.props.address);
      await registration.methods.registerProvider().send({
        from: accounts[0],
        value:this.state.providerFees
      });
    } catch (err) {
      this.setState({ errorMessage3: err.message });
    }
    this.setState({ loading3: false });
  };

 


  render() {
    return (
      <Layout>
        <h3>Registration Form</h3>
        <Segment>
        <Form onSubmit={this.onSubmitManufacturer} error={!!this.state.errorMessage1}>
          <Form.Field style={{ marginTop: "20px" }}>
            <label>Enter Manufacturer Admission Fees (Manufacturer)</label>
            <Input
              label="Wei"
              labelPosition="right"
              value={this.state.manufacturerFees}
              onChange={event =>
                this.setState({ manufacturerFees: event.target.value })
              }
            ></Input>
          </Form.Field>
          <Button loading={this.state.loading1} color="teal">Register Manufacturer</Button>
        <Message error header="Oops!" content={this.state.errorMessage1} />

        </Form>
        <Divider section />
        <Form onSubmit={this.onSubmitDistributor} error={!!this.state.errorMessage2}>
          <Form.Field style={{ marginTop: "20px" }}>
            <label>Enter Distributor's Address (GPO)</label>
            <Input
              label="Address"
              labelPosition="right"
              value={this.state.distributorAdd}
              onChange={event =>
                this.setState({ distributorAdd: event.target.value })
              }
            ></Input>
          </Form.Field>
          <Button loading={this.state.loading2} color="teal">Register Distributor</Button>
        <Message error header="Oops!" content={this.state.errorMessage2} />

        </Form>
        <Divider section />
        <Form onSubmit={this.onSubmitProvider} error={!!this.state.errorMessage3}>
          <Form.Field style={{ marginTop: "20px" }}>
            <label>Enter Service Provider Admission Fees (Provider)</label>
            <Input
              label="Wei"
              labelPosition="right"
              value={this.state.providerFees}
              onChange={event =>
                this.setState({ providerFees: event.target.value })
              }
            ></Input>
          </Form.Field>
          <Button loading={this.state.loading3} color="teal">Register Distributor</Button>
        <Message error header="Oops!" content={this.state.errorMessage3} />
        </Form>
        
        </Segment>

      </Layout>
    );
  }
}
export default Registration;
