import React, { Component } from "react";
import { Form, Button, Input,Message,Segment,Divider } from "semantic-ui-react";
import Layout from "../components/Layout";
import LoyaltyRebate from "../../ethereum/LoyaltyRebateCon";
import web3 from "../../ethereum/web3";

class Registration extends Component {
  state = {
    providerAdd: "",
    bonus:"",
    loading: false,
    errorMessage:"",
  };
  static async getInitialProps(props)
  {
    const {address} = props.query;
    return {address};

  }
  onSubmitApprove = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    try {
        console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const loyaltyRebate=LoyaltyRebate(this.props.address);
      await loyaltyRebate.methods.sendLoyaltyRebate(this.state.providerAdd).send({
        from: accounts[0],
        value:this.state.bonus
      });
    } catch (err) {
      this.setState({ errorMessage: err.message});
    }
    this.setState({ loading: false });
  };


  render() {
    return (
      <Layout>
        <h3>Loyalty Bonus Form</h3>
        <Segment>
        <h5>Send Loyalty Bonus (GPO)</h5>
        <Form onSubmit={this.onSubmitApprove} error={!!this.state.errorMessage}>
          
          <Form.Field style={{ marginTop: "20px" }}>
            <label>Enter Service Provider's Address</label>
            <Input
              label="Address"
              labelPosition="right"
              value={this.state.providerAdd}
              onChange={event =>
                this.setState({ providerAdd: event.target.value })
              }
            ></Input>
          </Form.Field>
          <Form.Field style={{ marginTop: "20px" }}>
            <label>Enter Bonus Amount</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.bonus}
              onChange={event =>
                this.setState({ bonus: event.target.value })
              }
            ></Input>
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} color="teal">Approve</Button>
        </Form>
        </Segment>

      </Layout>
    );
  }
}
export default Registration;
