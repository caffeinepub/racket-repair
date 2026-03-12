import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";

actor {
  type RepairRequest = {
    name : Text;
    email : Text;
    phone : Text;
    racketBrand : Text;
    damageDescription : Text;
    submissionTimestamp : Time.Time;
  };

  module RepairRequest {
    public func compare(request1 : RepairRequest, request2 : RepairRequest) : Order.Order {
      Int.compare(request1.submissionTimestamp, request2.submissionTimestamp);
    };
  };

  var nextRequestId = 0;
  let repairRequests = Map.empty<Nat, RepairRequest>();

  public shared ({ caller }) func submitRepairRequest(name : Text, email : Text, phone : Text, racketBrand : Text, damageDescription : Text) : async () {
    let request : RepairRequest = {
      name;
      email;
      phone;
      racketBrand;
      damageDescription;
      submissionTimestamp = Time.now();
    };
    repairRequests.add(nextRequestId, request);
    nextRequestId += 1;
  };

  public query ({ caller }) func getAllRepairRequests() : async [RepairRequest] {
    repairRequests.values().toArray().sort();
  };
};
