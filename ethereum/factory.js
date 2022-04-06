import web3 from "./web3";
import ContractFactory from "./build/ContractFactory.json";

const instance = new web3.eth.Contract(
  ContractFactory.abi,
  "0x0572Ea8b2A4b58ef4E605BdAF9853D92d72e9351"
);
export default instance;
