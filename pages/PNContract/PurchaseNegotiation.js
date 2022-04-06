import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Message,
  Grid,
  Divider,
  Segment,
} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import Layout from "../components/Layout";
import PurchaseNegotiationCon from "../../ethereum/PurchaseNegotiationCon";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";
import { firebase, FieldValue } from '../config'

class PurchaseNegotiation extends Component {
  state = {
    productId: "",
    quantity: "",
    manufacturerAdd: "",
    contractNumberNC: "",
    contractNumberCS: "",
    contractNumberAD: "",

    distributorAdd: "",
    price: "",
    statusCon: false,
    loadingNC: false,
    loadingNegoC: false,
    loadingCS: false,
    loadingAD: false,
    errorMessageNC: "",
    errorMessageNegoC: "",
    errorMessageCS: "",
    errorMessageAD: "",
  };
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  onSubmitNewContract = async (event) => {
    event.preventDefault();
    this.setState({ loadingNC: true });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);

      await purchaseNegotiationCon.methods
        .newContract(
          this.state.productId,
          this.state.quantity,
          this.state.manufacturerAdd
        )
        .send({
          from: accounts[0],
        });
      const conAdd = await purchaseNegotiationCon.methods.contractAddresses().call();
      const address = await factory.methods
          .deployedRegistrationContracts(accounts[0], 0)
          .call();
      firebase.firestore().collection('Purchase_Negotiation').add({
        parentRegID: address,
        pnID: this.props.address,
        contractID: conAdd,
        manufacturerAdd: this.state.manufacturerAdd
      })
    } catch (err) {
      this.setState({
        errorMessageNC: err.message,
      });
    }
    this.setState({ loadingNC: false });
  };

  onSubmitNegotiateContract = async (event) => {
    event.preventDefault();
    this.setState({ loadingNegoC: true });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);

      await purchaseNegotiationCon.methods
        .negotiateContract(this.state.contractNumberNC, this.state.price)
        .send({
          from: accounts[0],
        });
    } catch (err) {
      this.setState({
        errorMessageNegoC: err.message,
      });
      console.log(err.message);
    }
    this.setState({ loadingNegoC: false });
  };

  onSubmitContractStatus = async (event) => {
    event.preventDefault();
    this.setState({ loadingCS: true });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);

      await purchaseNegotiationCon.methods
        .contractStatus(this.state.contractNumberCS, this.state.statusCon)
        .send({
          from: accounts[0],
        });
      if (this.state.statusCon) {
        console.log(
          "upload metadata to IPFS and ask user to check contract via load contract"
        );
      }
    } catch (err) {
      this.setState({
        errorMessageNegoC: err.message,
      });
      console.log(err.message);
    }
    this.setState({ loadingCS: false });
  };

  onSubmitAssignDistributor = async (event) => {
    event.preventDefault();
    this.setState({ loadingAD: true });
    try {
      console.log("i am here");
      const accounts = await web3.eth.getAccounts();
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);

      await purchaseNegotiationCon.methods
        .assignDistributor(
          this.state.contractNumberAD,
          this.state.distributorAdd
        )
        .send({
          from: accounts[0],
        });
    } catch (err) {
      this.setState({
        errorMessageNegoC: err.message,
      });
      console.log(err.message);
    }
    this.setState({ loadingAD: false });
  };

  render() {
    return (
      <Layout>
        <div>
          <Link route={`/PNContract/LoadContract/${this.props.address}`}>
            <a>
              <Button color="teal" floated="right">
                Load Contract
              </Button>
            </a>
          </Link>
          <h3>Purchase Negotiation Forms</h3>
        </div>
        <Segment>
          <Grid columns={1} divided>
            {/* New Contract Code */}
            <Grid.Row>
              <Grid.Column>
                <h5>New Contract (GPO)</h5>
                <Form
                  onSubmit={this.onSubmitNewContract}
                  error={!!this.state.errorMessageNC}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Product Id</label>
                    <Input
                      label="id"
                      labelPosition="right"
                      value={this.state.productId}
                      onChange={(event) =>
                        this.setState({ productId: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Quantity</label>
                    <Input
                      label="quantity"
                      labelPosition="right"
                      value={this.state.quantity}
                      onChange={(event) =>
                        this.setState({ quantity: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Manufacturer's Address</label>
                    <Input
                      label="address"
                      labelPosition="right"
                      value={this.state.manufacturerAdd}
                      onChange={(event) =>
                        this.setState({ manufacturerAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Button loading={this.state.loadingNC} color="teal">
                    New Contract
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessageNC}
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <br></br>
          <Divider section />
          <br></br>

          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
                {/* Negotiate Contract Code */}
                <h5>Negotiate Contract (Manufacturer)</h5>
                <Form
                  onSubmit={this.onSubmitNegotiateContract}
                  error={!!this.state.errorMessageNegoC}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractNumberNC}
                      onChange={(event) =>
                        this.setState({ contractNumberNC: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Price</label>
                    <Input
                      label="price"
                      labelPosition="right"
                      value={this.state.price}
                      onChange={(event) =>
                        this.setState({ price: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Button loading={this.state.loadingNegoC} color="teal">
                    Negotiate Contract
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessageNegoC}
                  />
                </Form>
              </Grid.Column>

              <Grid.Column>
                {/*Contract Status Code*/}
                <h5>Contract Status (GPO)</h5>
                <Form
                  onSubmit={this.onSubmitContractStatus}
                  error={!!this.state.errorMessageCS}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractNumberCS}
                      onChange={(event) =>
                        this.setState({ contractNumberCS: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Do you Accept The Price</label>
                    <Input
                      label="true/false"
                      labelPosition="right"
                      value={this.state.statusCon}
                      onChange={(event) =>
                        this.setState({ statusCon: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Button loading={this.state.loadingCS} color="teal">
                    Update Status
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessageCS}
                  />
                </Form>
              </Grid.Column>

              <Grid.Column>
                {/*Assign Distributor Code*/}
                <h5>Assign Distributor (GPO)</h5>
                <Form
                  onSubmit={this.onSubmitAssignDistributor}
                  error={!!this.state.errorMessageAD}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractNumberAD}
                      onChange={(event) =>
                        this.setState({ contractNumberAD: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Distributor's Address</label>
                    <Input
                      label="address"
                      labelPosition="right"
                      value={this.state.distributorAdd}
                      onChange={(event) =>
                        this.setState({ distributorAdd: event.target.value })
                      }
                    ></Input>
                  </Form.Field>

                  <Button loading={this.state.loadingAD} color="teal">
                    Negotiate Contract
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessageAD}
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Layout>
    );
  }
}
export default PurchaseNegotiation;
