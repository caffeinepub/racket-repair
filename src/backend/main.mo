import Map "mo:core/Map";
import Time "mo:core/Time";

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

  // Stable storage
  stable var stableRepairRequests : [RepairRequest] = [];
  stable var stableStockItems : [StockItem] = [];
  stable var stableStockTransactions : [StockTransaction] = [];
  stable var nextRequestId : Nat = 0;
  stable var nextStockItemId : Nat = 0;
  stable var nextTransactionId : Nat = 0;

  // In-memory maps (rebuilt from stable on upgrade)
  let repairRequests = Map.empty<Nat, RepairRequest>();
  let stockItems = Map.empty<Nat, StockItem>();
  let stockTransactions = Map.empty<Nat, StockTransaction>();

  // Initialize from stable storage on first deploy / after upgrade
  private func restoreFromStable() {
    for (r in stableRepairRequests.vals()) {
      repairRequests.add(r.id, r);
    };
    for (s in stableStockItems.vals()) {
      stockItems.add(s.id, s);
    };
    for (t in stableStockTransactions.vals()) {
      stockTransactions.add(t.id, t);
    };
  };

  restoreFromStable();

  system func preupgrade() {
    stableRepairRequests := repairRequests.values().toArray();
    stableStockItems := stockItems.values().toArray();
    stableStockTransactions := stockTransactions.values().toArray();
  };

  system func postupgrade() {
    restoreFromStable();
  };

  // Repair Request Methods

  public shared func submitRepairRequest(
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
    stableRepairRequests := repairRequests.values().toArray();
    nextRequestId += 1;
  };

  public query func getAllRepairRequests() : async [RepairRequest] {
    repairRequests.values().toArray();
  };

  public shared func updateRepairRequest(
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
      case (?existing) {
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
          submissionTimestamp = existing.submissionTimestamp;
        };
        repairRequests.add(id, updatedRequest);
        stableRepairRequests := repairRequests.values().toArray();
        true;
      };
    };
  };

  public shared func updateStatus(id : Nat, status : Text) : async Bool {
    switch (repairRequests.get(id)) {
      case (null) { false };
      case (?request) {
        let updatedRequest = { request with status };
        repairRequests.add(id, updatedRequest);
        stableRepairRequests := repairRequests.values().toArray();
        true;
      };
    };
  };

  public shared func deleteRepairRequest(id : Nat) : async Bool {
    if (repairRequests.containsKey(id)) {
      repairRequests.remove(id);
      stableRepairRequests := repairRequests.values().toArray();
      true;
    } else {
      false;
    };
  };

  // Stock Inventory System

  public shared func addStockItem(name : Text, category : Text, unit : Text) : async () {
    let item : StockItem = {
      id = nextStockItemId;
      name;
      category;
      unit;
    };
    stockItems.add(nextStockItemId, item);
    stableStockItems := stockItems.values().toArray();
    nextStockItemId += 1;
  };

  public query func getStockItems() : async [StockItem] {
    stockItems.values().toArray();
  };

  public shared func deleteStockItem(id : Nat) : async Bool {
    if (stockItems.containsKey(id)) {
      stockItems.remove(id);
      stableStockItems := stockItems.values().toArray();
      true;
    } else {
      false;
    };
  };

  public shared func addStockTransaction(itemId : Nat, txType : Text, quantity : Nat, notes : Text) : async Bool {
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
        stableStockTransactions := stockTransactions.values().toArray();
        nextTransactionId += 1;
        true;
      };
    };
  };

  public query func getStockTransactions() : async [StockTransaction] {
    stockTransactions.values().toArray();
  };

  public shared func deleteStockTransaction(id : Nat) : async Bool {
    if (stockTransactions.containsKey(id)) {
      stockTransactions.remove(id);
      stableStockTransactions := stockTransactions.values().toArray();
      true;
    } else {
      false;
    };
  };
};
