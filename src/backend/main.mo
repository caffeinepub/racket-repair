import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";



actor {
  type RepairRequest = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    racketBrand : Text;
    damageDescription : Text;
    submissionTimestamp : Time.Time;
  };

  var nextRequestId = 0;
  let repairRequests = Map.empty<Nat, RepairRequest>();

  public shared ({ caller }) func submitRepairRequest(name : Text, email : Text, phone : Text, racketBrand : Text, damageDescription : Text) : async () {
    let request : RepairRequest = {
      id = nextRequestId;
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
    repairRequests.values().toArray();
  };

  public shared ({ caller }) func updateRepairRequest(id : Nat, name : Text, email : Text, phone : Text, racketBrand : Text, damageDescription : Text) : async Bool {
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
          submissionTimestamp = existing.submissionTimestamp;
        };
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
};
