import express from "express";
import {Data} from "../model.js"; // Replace with your actual model import

const router = express.Router();

// Endpoint for bar chart data
router.post("/bar-chart-data", async (req, res) => {
  try {
    const { startDate, endDate, filters } = req.body;

    // Construct query
    const query = {
      Day: {
        $gte: new Date(startDate).toISOString().split("T")[0],
        $lte: new Date(endDate).toISOString().split("T")[0],
      },
      Age: filters?.Age || "15-25", // Default age filter
      Gender: filters?.Gender || "Male", // Default gender filter
    };

    const results = await Data.find(query);
    if (results.length === 0) {
      return res.status(404).send("No data found for the bar chart");
    }

    // Aggregate the results for bar chart
    const barChartData = results.reduce((acc, curr) => {
      for (const key of ["A", "B", "C", "D", "E", "F"]) {
        acc[key] = (acc[key] || 0) + (curr[key] || 0);
      }
      return acc;
    }, {});

    res.json(barChartData);
  } catch (err) {
    console.error("Error in /bar-chart-data:", err);
    res.status(500).send("Server Error");
  }
});

// Endpoint for line chart data
router.post("/line-chart-data", async (req, res) => {
  try {
    const { startDate, endDate, feature } = req.body;

    // Construct query
    const query = {
      Day: {
        $gte: new Date(startDate).toISOString().split("T")[0],
        $lte: new Date(endDate).toISOString().split("T")[0],
      },
    };

    const results = await Data.find(query);
    if (results.length === 0) {
      return res.status(404).send("No data found for the line chart");
    }

    // Prepare data for the line chart
    const lineChartData = results.map((result) => ({
      day: new Date(result.Day).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      }), // Format as "31 Aug"
      timeSpent: (result[feature] / 60).toFixed(2), // Convert to hours and format
    }));

    res.json(lineChartData);
  } catch (err) {
    console.error("Error in /line-chart-data:", err);
    res.status(500).send("Server Error");
  }
});

export default router;
