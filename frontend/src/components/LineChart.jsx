import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const LineChartComp = ({ data }) => {
  return (
    <div style={{ margin: "20px" }}>
      <LineChart
        width={600}
        height={400}
        data={data}
        margin={{  right: 40, bottom: 50, left: 70 }} 
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          label={{
            value: "Day",
            position: "bottom",
            offset: 20,
            style: { fontWeight: "bold" },
          }}
          tickFormatter={(day) => day} 
          style={{ fontSize: "12px" }}
        />
        <YAxis
          label={{
            angle: -90,
            position: "insideLeft",
            offset: -10,
            style: { fontWeight: "bold" },
          }}
          domain={[0, 20]} 
          style={{ fontSize: "12px" }}
        />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line
          type="monotone"
          dataKey="timeSpent"
          stroke="#8884d8"
          dot={{ r: 3 }} 
        />
      </LineChart>
    </div>
  );
};

export default LineChartComp;