import web3 from "./web3";
import PurchaseOrder from './build/PurchaseOrders.json';

export default address => {
    return new web3.eth.Contract(PurchaseOrder.abi, address);
  };