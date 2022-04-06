import web3 from "./web3";
import Registration from "./build/Registration.json";

export default address => {
  return new web3.eth.Contract(Registration.abi, address);
};
