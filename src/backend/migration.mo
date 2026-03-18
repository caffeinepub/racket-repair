import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
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

  type OldActor = {
    nextRequestId : Nat;
    repairRequests : Map.Map<Nat, RepairRequest>;
    entries : [(Nat, RepairRequest)];
  };

  type NewActor = {
    nextRequestId : Nat;
    repairRequests : Map.Map<Nat, RepairRequest>;
    nextStockItemId : Nat;
    nextTransactionId : Nat;
    stockItems : Map.Map<Nat, StockItem>;
    stockTransactions : Map.Map<Nat, StockTransaction>;
  };

  public func run(old : OldActor) : NewActor {
    {
      nextRequestId = old.nextRequestId;
      repairRequests = old.repairRequests;
      nextStockItemId = 0;
      nextTransactionId = 0;
      stockItems = Map.empty<Nat, StockItem>();
      stockTransactions = Map.empty<Nat, StockTransaction>();
    };
  };
};
