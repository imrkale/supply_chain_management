import web3 from "./web3";
import loyaltyRebate from './build/LoyaltyRebates.json';

export default address => {
    return new web3.eth.Contract(loyaltyRebate.abi, address);
  };
  