const path = require("path");
const solc = require("solc");
const fs = require("fs-extra"); //file system..fs-extra....has some extra features apart from provided by node
const buildPath = path.resolve(__dirname, "build"); // referencing build directory in our current directory(__dirname)
fs.removeSync(buildPath); // node fs doesn't have cmd to easily remove everything inside folder;
//removeSync search for folder and delete all residing files
const procurePath = path.resolve(__dirname, "contracts", "Procure.sol");
const source = fs.readFileSync(procurePath, "utf8"); // getting contents of Campaign.sol file
const input = {
  language: "Solidity",
  sources: {
    "Procure.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Procure.sol"
];

fs.ensureDirSync(buildPath); // check if build directory exist...if no c- it will create one

// console.log(output);
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"), // contract is key in output(json)
    output[contract]
  );
}
