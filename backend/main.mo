import Text "mo:base/Text";

import Float "mo:base/Float";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor Calculator {
  public func calculate(operation: Text, x: Float, y: Float) : async Result.Result<Float, Text> {
    switch (operation) {
      case ("add") { #ok(x + y) };
      case ("subtract") { #ok(x - y) };
      case ("multiply") { #ok(x * y) };
      case ("divide") {
        if (y == 0) {
          #err("Division by zero")
        } else {
          #ok(x / y)
        }
      };
      case (_) { #err("Invalid operation") };
    }
  };
}
