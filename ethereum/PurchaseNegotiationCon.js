import web3 from "./web3";
import PurchaseNegotiation from './build/PurchaseNegotiation.json';

export default address => {
  return new web3.eth.Contract(PurchaseNegotiation.abi, address);
};
