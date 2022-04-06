import web3 from "./web3";
import RebateSettlement from './build/RebatesSettelment.json';

export default address => {
    return new web3.eth.Contract(RebateSettlement.abi, address);
  };