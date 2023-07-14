import { Model } from "objection";

class BaseModel extends Model {
  static get defaultGraphOptions() {
    return {
      minimize: true,
    };
  }
}

export default BaseModel;
