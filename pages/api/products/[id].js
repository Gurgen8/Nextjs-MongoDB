import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const { method, query: { id } } = req;
  dbConnect();
  // const token= cookies.token

  if (method === "GET") {
    try {
      const product = await Product.findById(id);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  }


  if (method === "PUT") {
    // if(!token || token !== process.env.TOKEN){
    //   return res.status(401).json("Not authenticated!")
    // }
    try {
      const products = await Product.findByIdAndUpdate(id,req.body,{new:true});
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  }


  if (method === "DELETE") {
    // if(!token || token !== process.env.TOKEN){
    //   return res.status(401).json("Not authenticated!")
    // }
    try {
      await Product.findByIdAndDelete(id);
      res.status(202).json("product has been deleted!...");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}