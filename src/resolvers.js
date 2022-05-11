//import * as res from "./db";
import {res} from "./db";

const resolvers = {
  Query: {
    pair: (parent, { name }, context, info) => {
      return res(name);
    }
  }
};

export default resolvers;