import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Message,
  Grid,
  Item,
  Segment,
  Link,
} from "semantic-ui-react";
import Layout from "../components/Layout";
import PurchaseNegotiationCon from "../../ethereum/PurchaseNegotiationCon";

class LoadContract extends Component {
  state = {
    contractNumber: "",
    statusCon: [
      "New Contract",
      "Negotiating",
      "Price Confirmed",
      "Price Rejected",
      "Contract Closed",
    ],
    loading: false,
    errorMessage: "",
    object: [],
  };
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }
  onSubmitLoadContract = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    try {
      console.log("i am here");
      const purchaseNegotiationCon = PurchaseNegotiationCon(this.props.address);
      this.state.object = await purchaseNegotiationCon.methods
        .contracts(this.state.contractNumber)
        .call();
      console.log({ some: this.state.object });
    } catch (err) {
      this.setState({
        errorMessage: err.message,
      });
      console.log(err.message);
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <div>
          <h3>Load contract details using contract number</h3>
        </div>

        <Segment>
          <Grid columns={2} divided>
            <Grid.Row>
              <Grid.Column>
                <h5>Load Contract</h5>
                <Form
                  onSubmit={this.onSubmitLoadContract}
                  error={!!this.state.errorMessage}
                >
                  <Form.Field style={{ marginTop: "20px" }}>
                    <label>Enter Contract Number</label>
                    <Input
                      label="number"
                      labelPosition="right"
                      value={this.state.contractNumber}
                      onChange={(event) =>
                        this.setState({ contractNumber: event.target.value })
                      }
                    ></Input>
                  </Form.Field>
                  <Button loading={this.state.loading} color="teal">
                    Load Contract
                  </Button>
                  <Message
                    style={{ marginTop: "20px" }}
                    error
                    header="Oops!"
                    content={this.state.errorMessage}
                  />
                </Form>
              </Grid.Column>
              <Grid.Column>
                <h5>Contract</h5>

                <Item.Group>
                  <Item>
                    <Item.Content>
                      <Item.Meta>Product Id</Item.Meta>
                      <Item.Extra>{this.state.object[2]}</Item.Extra>
                    </Item.Content>
                  </Item>
                  <Item>
                    <Item.Content>
                      <Item.Meta>Price</Item.Meta>
                      <Item.Extra>{this.state.object[4]}</Item.Extra>
                    </Item.Content>
                  </Item>
                  <Item>
                    <Item.Content>
                      <Item.Meta>Manufacturer Address</Item.Meta>
                      <Item.Extra>{this.state.object[0]}</Item.Extra>
                    </Item.Content>
                  </Item>
                  <Item>
                    <Item.Content>
                      <Item.Meta>Distributor Address</Item.Meta>
                      <Item.Extra>{this.state.object[1]}</Item.Extra>
                    </Item.Content>
                  </Item>
                  <Item>
                    <Item.Content>
                      <Item.Meta>Contract Status</Item.Meta>
                      <Item.Extra>
                        {this.state.statusCon[this.state.object[5]]}
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Layout>
    );
  }
}
export default LoadContract;
