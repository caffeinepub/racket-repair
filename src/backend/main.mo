import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  type RepairRequest = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    racketBrand : Text;
    damageDescription : Text;
    serviceType : Text;
    stringType : Text;
    paymentMode : Text;
    status : Text;
    numberOfRackets : Nat;
    charges : Text;
    submissionTimestamp : Time.Time;
  };

  type StockItem = {
    id : Nat;
    name : Text;
    category : Text;
    unit : Text;
  };

  type StockTransaction = {
    id : Nat;
    itemId : Nat;
    txType : Text;
    quantity : Nat;
    notes : Text;
    timestamp : Time.Time;
  };

  var nextRequestId = 0;
  var nextStockItemId = 0;
  var nextTransactionId = 0;

  let repairRequests = Map.empty<Nat, RepairRequest>();
  let stockItems = Map.empty<Nat, StockItem>();
  let stockTransactions = Map.empty<Nat, StockTransaction>();

  // Repair Request Methods

  public shared ({ caller }) func submitRepairRequest(
    name : Text,
    email : Text,
    phone : Text,
    racketBrand : Text,
    damageDescription : Text,
    serviceType : Text,
    stringType : Text,
    paymentMode : Text,
    numberOfRackets : Nat,
  ) : async () {
    let request : RepairRequest = {
      id = nextRequestId;
      name;
      email;
      phone;
      racketBrand;
      damageDescription;
      serviceType;
      stringType;
      paymentMode;
      status = "Pending";
      numberOfRackets;
      charges = "";
      submissionTimestamp = Time.now();
    };

    repairRequests.add(nextRequestId, request);
    nextRequestId += 1;
  };

  public query ({ caller }) func getAllRepairRequests() : async [RepairRequest] {
    repairRequests.values().toArray();
  };

  public shared ({ caller }) func updateRepairRequest(
    id : Nat,
    name : Text,
    email : Text,
    phone : Text,
    racketBrand : Text,
    damageDescription : Text,
    serviceType : Text,
    stringType : Text,
    paymentMode : Text,
    status : Text,
    numberOfRackets : Nat,
    charges : Text,
  ) : async Bool {
    switch (repairRequests.get(id)) {
      case (null) { false };
      case (?_) {
        let updatedRequest : RepairRequest = {
          id;
          name;
          email;
          phone;
          racketBrand;
          damageDescription;
          serviceType;
          stringType;
          paymentMode;
          status;
          numberOfRackets;
          charges;
          submissionTimestamp = Time.now();
        };
        repairRequests.add(id, updatedRequest);
        true;
      };
    };
  };

  public shared ({ caller }) func updateStatus(id : Nat, status : Text) : async Bool {
    switch (repairRequests.get(id)) {
      case (null) { false };
      case (?request) {
        let updatedRequest = { request with status };
        repairRequests.add(id, updatedRequest);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteRepairRequest(id : Nat) : async Bool {
    if (repairRequests.containsKey(id)) {
      repairRequests.remove(id);
      true;
    } else {
      false;
    };
  };

  // Stock Inventory System

  public shared ({ caller }) func addStockItem(name : Text, category : Text, unit : Text) : async () {
    let item : StockItem = {
      id = nextStockItemId;
      name;
      category;
      unit;
    };
    stockItems.add(nextStockItemId, item);
    nextStockItemId += 1;
  };

  public query ({ caller }) func getStockItems() : async [StockItem] {
    stockItems.values().toArray();
  };

  public shared ({ caller }) func deleteStockItem(id : Nat) : async Bool {
    if (stockItems.containsKey(id)) {
      stockItems.remove(id);
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func addStockTransaction(itemId : Nat, txType : Text, quantity : Nat, notes : Text) : async Bool {
    switch (stockItems.get(itemId)) {
      case (null) { false };
      case (?_) {
        let tx : StockTransaction = {
          id = nextTransactionId;
          itemId;
          txType;
          quantity;
          notes;
          timestamp = Time.now();
        };
        stockTransactions.add(nextTransactionId, tx);
        nextTransactionId += 1;
        true;
      };
    };
  };

  public query ({ caller }) func getStockTransactions() : async [StockTransaction] {
    stockTransactions.values().toArray();
  };

  public shared ({ caller }) func deleteStockTransaction(id : Nat) : async Bool {
    if (stockTransactions.containsKey(id)) {
      stockTransactions.remove(id);
      true;
    } else {
      false;
    };
  };
};
