
pragma solidity >=0.6.0;

contract ContractFactory{                   // this contract factory will keep record of all deployed contract

    address institute;                      // address of institution who provides service via web app

    mapping(address=>address[5]) public deployedRegistrationContracts;    // address array for all deployed contract beloging to GPO
    mapping(address=>bool) registeredGPOs;

    constructor() public{
        institute=msg.sender;               // assigning deployer of contractFactory contract as institute address
    }

    modifier onlyGPOs{                   
      require(registeredGPOs[msg.sender]==true,
      "Sender not authorized as GPO."
      );
      _;                                
    }

    event registrationDeployed( address registrationContractAddress );
    event purchaseNegotiationDeployed( address purchaseNegotiationAddress);
    event purchaseOrderDeployed( address purchaseOrderAddress );
    event rebateSettlementDeployed( address rebatesSettelmentAddress );
    event loyaltyRebateDeployed( address loyaltyRebatesAddress );

    function createRegistration() public{
        require(!registeredGPOs[msg.sender],"Registration done already");

        Registration newRegistration = new Registration(msg.sender);
        deployedRegistrationContracts[msg.sender][0]=address(newRegistration);
        registeredGPOs[msg.sender]=true;

        emit registrationDeployed(deployedRegistrationContracts[msg.sender][0]);
    }

    function createPurchaseNegotiations() public onlyGPOs{
        require(deployedRegistrationContracts[msg.sender][0]!=address(0),"Registration not deployed yet");
        require(deployedRegistrationContracts[msg.sender][1]==address(0),"Purchase negotiation already deployed");

        PurchaseNegotiation newPurchaseNegotiation = new PurchaseNegotiation(deployedRegistrationContracts[msg.sender][0]);
        deployedRegistrationContracts[msg.sender][1]=address(newPurchaseNegotiation);

        emit purchaseNegotiationDeployed(deployedRegistrationContracts[msg.sender][1]);
    }
    
    function createPurchaseOrders() public onlyGPOs{
        require(deployedRegistrationContracts[msg.sender][1]!=address(0),"Purchase negotiation not deployed yet");
        require(deployedRegistrationContracts[msg.sender][2]==address(0),"Purchase order already deployed");

        PurchaseOrders newPurchaseOrders = new PurchaseOrders(deployedRegistrationContracts[msg.sender][0]);
        deployedRegistrationContracts[msg.sender][2]=address(newPurchaseOrders);

        emit purchaseOrderDeployed(deployedRegistrationContracts[msg.sender][2]);
    }

    function createRebatesSettelment() public onlyGPOs{
        require(deployedRegistrationContracts[msg.sender][2]!=address(0),"Purchase order not deployed yet");
        require(deployedRegistrationContracts[msg.sender][3]==address(0),"Rebate settlement already deployed");

        RebatesSettelment newRebatesSettelment = new RebatesSettelment(deployedRegistrationContracts[msg.sender][0]);
        deployedRegistrationContracts[msg.sender][3]=address(newRebatesSettelment);

        emit rebateSettlementDeployed(deployedRegistrationContracts[msg.sender][3]);
    }

    function createLoyaltyRebates() public onlyGPOs{
        require(deployedRegistrationContracts[msg.sender][3]!=address(0),"Rebate settlement not deployed yet");
        require(deployedRegistrationContracts[msg.sender][4]==address(0),"Loyalty already deployed");

        LoyaltyRebates newLoyaltyRebates = new LoyaltyRebates(deployedRegistrationContracts[msg.sender][0]);
        deployedRegistrationContracts[msg.sender][4]=address(newLoyaltyRebates);

        emit loyaltyRebateDeployed(deployedRegistrationContracts[msg.sender][4]);
    }

    
}

contract Registration {             // contract to all stake holders involved in contract
                                    // if parties are not changing then this is one time investment
                                    // new instance creates fully new contract seperated from other
    address payable GPO;            // GPO can recieve fund
    uint constant manufacuterFee=1;         // fees in wei or ether
    uint constant serviceProviderPFee=1;
    mapping(address=>bool) manufacturers;       // mapping address to check their presence
    mapping(address=>bool) distributors;
    mapping(address=>bool) serviceproviders;
    
    
    event ManufacturerRegistered(address manufactuer); // function execution triggers event & print logs
    event DistributorRegistered(address distributor);
    event serviceProviderRegistered(address serviceProvider);

    modifier onlyGPO{                   // Like an inline function 
      require(msg.sender == GPO,
      "Sender not authorized."
      );
      _;                                // code after above condition are met
    }   
    
    constructor(address creator) public{               // declare contract creator as GPO
        GPO=payable(creator);
    }
    
    function registerManufacturer() public payable{
        require(!manufacturers[msg.sender] && !distributors[msg.sender] && !serviceproviders[msg.sender],
        "Address already used");
        require(msg.value>=manufacuterFee,
        "Admission fee insufficient");
        
        manufacturers[msg.sender]=true;
        emit ManufacturerRegistered(msg.sender);       // function status is emitted
    }
    
    function registerDistributor(address d) public onlyGPO{
        require(!manufacturers[d] && !distributors[d] && !serviceproviders[d],
        "Address already used");
        
        distributors[d]=true;
        emit DistributorRegistered(d);
    }
    
    function registerProvider() public payable{
        require(!manufacturers[msg.sender] && !distributors[msg.sender] && !serviceproviders[msg.sender],
        "Address already used");
        require(msg.value>=serviceProviderPFee,
        "Admission fee insufficient");

        serviceproviders[msg.sender]=true;
        emit serviceProviderRegistered(msg.sender);

    }
    // below function to check whether institution accessing contract is authorized
    function manufacturerExists(address m) public view returns(bool){
        return manufacturers[m];
    }

    function distributorExists(address d) public view returns(bool){
        return distributors[d];
    }
    
    function SPExists(address h) public view returns(bool){  // simple address can only transfer fund
        return serviceproviders[h];
    }
    
    function isGPO(address g) public view returns(bool){ // payable address can recieve funds
        return (g==GPO);
    }
    
    
}

contract PurchaseNegotiation{             // contract to negotiate price of goods to be purchased
    Registration registrationContract;    // inheriting registration contract with has-a relationship
    uint public contractAddresses;        // address of registration contract..to access it
    // enum to record states of various entities of order status
    enum status{                            
        NewContract,
        Negotiating,
        PriceConfirmed,
        PriceRejected,
        ContractClosed
    }
    // metadata of contract
    struct contractType{
        address manufacturer;
        address distributor;
        uint productID;
        uint quantity;
        uint price;
        status orderStatus;
    }
    //logs to be uploaded to IPFS
    
    mapping(uint=>contractType) public contracts;// mapping contracts to contract types of same parties..
    
    event NewContractPublished(uint contractAddress, uint quantityOrdered, address manufacturer);

    event PriceNegotiation(uint contractAddress, uint newPrice);

    event ContractConfirmed(uint contractAddress, uint quantity, address manufacturer, uint price);
    
    event ContractClosed(uint contractAddress);

    modifier onlyGPO{
      require(registrationContract.isGPO(msg.sender),
      "Sender not authorized."
      );
      _;
    }   
    
    modifier onlyManufacturer{
      require(registrationContract.manufacturerExists(msg.sender),
      "Sender not authorized."
      );
      _;
    }   
    
    constructor(address registrationAddress)public {
        registrationContract=Registration(registrationAddress);     // call to super class
        contractAddresses=uint(keccak256(abi.encodePacked(msg.sender,block.timestamp,address(this))));
        // current address of current contract, block.timestamp, address of super class contract

    }
    
    function newContract(uint productID, uint quantity, address manufacturer) public onlyGPO {
        require(registrationContract.manufacturerExists(manufacturer),
        "Manufacturer address not recognized."
        );
        contractAddresses++;                // whenever new contract is added...btw same parties
        contracts[contractAddresses]=contractType(manufacturer,address(0),productID,quantity,0,status.NewContract);
        // address(0) is 0x0 account special case...as ditributor is not assigned yet 
        emit NewContractPublished(contractAddresses, quantity, manufacturer);

    }
    
    function negotiateContract(uint contractAddress, uint newPrice) public onlyManufacturer{
        require(contracts[contractAddress].orderStatus==status.NewContract  || contracts[contractAddress].orderStatus==status.PriceRejected,
        "Contract not available for price negotiation."
        );
        require(contracts[contractAddress].manufacturer==msg.sender,
        "Manufacturer not authorized"    
        );
        emit PriceNegotiation(contractAddress, newPrice);
        contracts[contractAddress].price=newPrice;
        contracts[contractAddress].orderStatus=status.Negotiating;

    }

    function contractStatus(uint contractAddress, bool accepted) public onlyGPO{
        require(contracts[contractAddress].orderStatus==status.Negotiating,
        "Contract not available for price negotiation."
        );
        if(accepted){
            contracts[contractAddress].orderStatus=status.PriceConfirmed;
        emit ContractConfirmed(contractAddress, contracts[contractAddress].quantity, contracts[contractAddress].manufacturer, contracts[contractAddress].price);
        }
        else{
            contracts[contractAddress].orderStatus=status.PriceRejected;
        }
    }
    
    // after this function 0x0 account is replaced with distributor's address in contractType
    function assignDistributor(uint contractAddress, address distributor) public onlyGPO{
        require(contracts[contractAddress].orderStatus==status.PriceConfirmed,
        "Contract not confirmed."
        );
        require(registrationContract.distributorExists(distributor),
        "Distributor adaddress not valid"
        );
        contracts[contractAddress].distributor=distributor;
        emit ContractClosed(contractAddress);

    }
    

    

} 

contract PurchaseOrders{                // contract to generate and submit purchase order
    Registration registrationContract;
    
    struct PO_type{
        address serviceProvider;
        address distributor;
        bool delivered;
    }
    
    mapping(uint=>PO_type) POs;
    
    modifier onlyDistributor{
      require(registrationContract.distributorExists(msg.sender),
      "Sender not authorized."
      );
      _;
    }   
    
    modifier onlySP{
      require(registrationContract.SPExists(msg.sender),
      "Sender not authorized."
      );
      _;
    }   


    constructor(address registrationAddress)public {
        registrationContract=Registration(registrationAddress);
    }
    
    event POsubmitted(uint POnumber, address serviceProvider, address distributor);
    event OrderDelivered(uint POnumber);
    
    // onlySP can submit purchase order
    function submitPO(uint POnumber, address distributor) public onlySP{    
        POs[POnumber]=PO_type(msg.sender,distributor,false);
        emit POsubmitted(POnumber,msg.sender, distributor);

    }
    
    function deliverStatus(uint POnumber)public onlyDistributor{
        require(POs[POnumber].distributor==msg.sender,
        "Distributor not authorized"
        );
        
        POs[POnumber].delivered=true;
        emit OrderDelivered(POnumber);

    }
} 

contract RebatesSettelment{         // contract for giving bonuses
    Registration registrationContract;
    
    mapping(uint=>uint) rebateRequests;
    
    modifier onlyDistributor{
      require(registrationContract.distributorExists(msg.sender),
      "Sender not authorized."
      );
      _;
    }   
    
    modifier onlyManufacturer{
      require(registrationContract.manufacturerExists(msg.sender),
      "Sender not authorized."
      );
      _;
    }   
    
    event RequestSubmitted(uint contractAddress, address distributor, address manufacturer, uint amountRequested);
    event RequestApproved(uint contractAddress);
    
    constructor(address registrationAddress)public {
        registrationContract=Registration(registrationAddress);
        
    }
    
    
    function submitRebateRequest(uint contractAddress, uint amount, address manufacturer) public onlyDistributor{
        require(registrationContract.manufacturerExists(manufacturer),
        "Manufacturer address not authorized."
        );
        rebateRequests[contractAddress]=amount;
        emit RequestSubmitted(contractAddress,msg.sender,manufacturer,amount);
    }
    
    
    function approveRebateRequest(uint contractAddress, address payable distributor) public payable onlyManufacturer{
        require(rebateRequests[contractAddress]>0,// to check if rebate is requested
        "Rebate request not submitted for this contract."
        );
        require(msg.value>=rebateRequests[contractAddress],
        "Transferred amount insufficient."
        );
        rebateRequests[contractAddress]=0;
        emit RequestApproved(contractAddress);
        distributor.transfer(msg.value);
        
    }
} 

contract LoyaltyRebates{            // contract for giving loyalty bonuses
    Registration registrationContract;
    
    modifier onlyGPO{
      require(registrationContract.isGPO(msg.sender),
      "Sender not authorized."
      );
      _;
    }   
    
    constructor(address registrationAddress)public {
        registrationContract=Registration(registrationAddress);
        
    }
    
    function sendLoyaltyRebate(address payable serviceProvider) payable public onlyGPO{
      require(registrationContract.SPExists(serviceProvider),
      "service provider address not recognized."
      );   
      serviceProvider.transfer(msg.value);      // GPO gives bonus to service provider 
    }

    
} 
