import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const BarChartComp = ({ data, onBarClick, isLineChartVisible }) => {
  const handleBarClick = (data) => {
    if (onBarClick) {
      onBarClick(data.feature); 
    }
  };

  return (
    <div style={{ marginTop: isLineChartVisible ? "0rem" : "24rem", transform: "rotate(90deg)" }}>
      <BarChart width={300} height={500} data={data} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="feature" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="total"
          fill="#8884d8"
          barSize={20}
          onClick={handleBarClick} // Handle bar click
        />
      </BarChart>
    </div>
  );
};

export default BarChartComp;