import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Message,
  Segment,
  Divider,
  Grid,
} from "semantic-ui-react";
import Layout from "../components/Layout";
import RebateSettlement from "../../ethereum/RebateSettlementCon";
import web3 from "../../ethereum/web3";

class Registration extends Component {
  state = {
    manufacturerAdd: "",
    amount: "",
    distributorAdd: "",
    loadingRR: false,
    loadingAR: false,
    errorMessageAR: "",
    errorMessageRR: "",
    contractAdd: "",
    contractAddAR: "",
    bonus: "",
  };
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmitRebateRequest = async (event) => {
    event.preventDefault();
    this.setState({ loadingRR: true });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const rebateSettlement = RebateSettlement(this.props.address);

      await rebateSettlement.methods
        .submitRebateRequest(
          this.state.contractAdd,
          this.state.amount,
          this.state.manufacturerAdd
        )
        .send({
          from: accounts[0],
        });
    } catch (err) {
      this.setState({ errorMessageRR: err.message });
    }
    this.setState({ loadingRR: false });
  };

  onSubmitApproveRequest = async (event) => {
    event.preventDefault();
    this.setState({ loadingAR: true });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const rebateSettlement = RebateSettlement(this.props.address);

      await rebateSettlement.methods
        .approveRebateRequest(
          this.state.contractAddAR,
          this.state.distributorAdd
        )
        .send({
          from: accounts[0],
          value: this.state.bonus,
        });
    } catch (err) {
      this.setState({ errorMessageAR: err.message });
    }
    this.setState({ loadingAR: false });
  };

  render() {
    return (
      <Layout>
        <h3>Rebate Settlement Form</h3>
        <Segment>
          <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column>
                <h5>Rebate Request (Distrubutor)</h5>
                <Form
                  onSubmit={this.onSubmitRebateRequest}
                  error={!!this.state.errorMessageRR}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractAdd}
                      onChange={(event) =>
                        this.setState({ contractAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>

                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Amount To Be Paid</label>
                    <Input
                      label="wei"
                      labelPosition="right"
                      value={this.state.amount}
                      onChange={(event) =>
                        this.setState({ amount: event.target.value })
                      }
                    ></Input>
                  </Form.Field>

                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Manufacturer's Address</label>
                    <Input
                      label="Address"
                      labelPosition="right"
                      value={this.state.manufacturerAdd}
                      onChange={(event) =>
                        this.setState({ manufacturerAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Message
                    error
                    header="Oops!"
                    content={this.state.errorMessageRR}
                  />
                  <Button loading={this.state.loadingRR} color="teal">
                    Submit
                  </Button>
                </Form>
              </Grid.Column>
              <Grid.Column>
                <h5>Approve Rebate Request (Manufacturer)</h5>
                <Form
                  onSubmit={this.onSubmitApproveRequest}
                  error={!!this.state.errorMessageAR}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractAddAR}
                      onChange={(event) =>
                        this.setState({ contractAddAR: event.target.value })
                      }
                    ></Input>
                  </Form.Field>

                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Bonus Amount</label>
                    <Input
                      label="wei"
                      labelPosition="right"
                      value={this.state.bonus}
                      onChange={(event) =>
                        this.setState({ bonus: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Distributor's Address</label>
                    <Input
                      label="Address"
                      labelPosition="right"
                      value={this.state.distributorAdd}
                      onChange={(event) =>
                        this.setState({ distributorAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Message
                    error
                    header="Oops!"
                    content={this.state.errorMessageAR}
                  />
                  <Button loading={this.state.loadingAR} color="teal">
                    Approve
                  </Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Layout>
    );
  }
}
export default Registration;
