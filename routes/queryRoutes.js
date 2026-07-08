const express = require("express");
const router = express.Router();
const Query = require("../models/query");
/* =========================
   SUBMIT QUERY API
========================= */
router.post("/api/query",async (req, res) => {
  const {name,email,message} = req.body;
    try {
      const existing =
        await Query.findOne({
          email,
          message
        });
      if (existing) {
        return res.json({
          success: false,
          message:"You already submitted this query"
        });
      }
      const newQuery =new Query({name,email,message});
      await newQuery.save();
      res.status(201).json({
        success: true,
        message:
          "Query submitted successfully"
      });
    } catch (err) {
      console.error("Error submitting query:",err);
      res.status(500).json({
        success: false,
        message:"Something went wrong"
      });
    }
  }
);
module.exports = router;
