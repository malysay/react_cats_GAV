import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Button, Flex } from "antd";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);
interface PointData {
  x: number;
  y: number;
}

function LinearRegressionChart() {
  const defaultPm25: number[] = [
    110, 120, 115, 118, 115, 117, 111, 108, 115, 70, 40, 50, 80, 120, 350, 1900,
    750, 650, 110, 160, 120, 125, 500, 300, 30, 20, 30, 300, 900, 200, 180, 30,
    100, 50, 100, 30, 60, 60, 80, 1200, 1800, 800, 990, 700, 50, 20, 20, 30, 20,
    20, 20, 20, 20, 20,
  ];
  const defaultCov: number[] = [
    100, 95, 100, 89, 90, 95, 96, 97, 96, 95, 97, 96, 105, 108, 102, 99, 97, 95,
    96, 99, 103, 106, 120, 123, 115, 117, 118, 120, 141, 160, 155, 145, 143,
    145, 148, 143, 140, 138, 140, 140, 146, 148, 141, 140, 139, 138, 139, 140,
    141, 142, 150, 145, 144, 140,
  ];

  const [pm25, setPm25] = useState<number[]>(defaultPm25);
  const [cov, setCov] = useState<number[]>(defaultCov);
  const [showChart, setShowChart] = useState<boolean>(false);

  // Функция расчета коэффициентов регрессии
  const regression = (x: number[], y: number[]) => {
    const n = x.length;
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;
    const slope =
      x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0) /
      x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);
    const intercept = yMean - slope * xMean;

    return { slope, intercept };
  };

  const { slope, intercept } = regression(pm25, cov);

  // Подготовка данных для отображения
  const data = {
    datasets: [
      {
        label: "Data Points",
        data: pm25.map((x, i) => ({ x, y: cov[i] })) as PointData[],
        backgroundColor: "rgba(75, 192, 192, 1)",
        pointRadius: 5,
      },
      {
        label: "Regression Line",
        data: pm25.map((x) => ({ x, y: slope * x + intercept })) as PointData[],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        showLine: true,
        fill: false,
      },
    ],
  };

  const handleInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    type: "pm25" | "cov"
  ) => {
    const values = event.target.value
      .split(",")
      .map((v) => Math.min(parseFloat(v.trim()), 999));
    if (type === "pm25") setPm25(values);
    if (type === "cov") setCov(values);
  };

  // Сброс к исходным данным
  const handleReset = () => {
    setPm25(defaultPm25);
    setCov(defaultCov);
  };

  return (
    <div style={{ width: "60%", margin: "0 auto" }}>
      <h1>Linear Regression Visualization</h1>
      <Flex vertical justify="center" align="center" gap="middle">
        <Flex gap="middle">
          <label>PM2.5 Data (запятая разделитель):</label>
          <textarea
            onChange={(e) => handleInput(e, "pm25")}
            rows={3}
            style={{ width: "40vw" }}
            value={pm25.join(", ")}
          />
        </Flex>

        <Flex gap="middle">
          <label>COVID Data (запятая разделитель):</label>
          <textarea
            onChange={(e) => handleInput(e, "cov")}
            rows={3}
            style={{ minWidth: "40vw" }}
            value={cov.join(", ")}
          />
        </Flex>

        <Flex gap="middle">
          <Button onClick={() => setShowChart(true)}>Показать график</Button>
          <Button onClick={handleReset}>Сбросить к дефолтным значениям</Button>
        </Flex>
      </Flex>

      {showChart && (
        <Flex justify="center" style={{ width: "100%", height: "600px", marginTop: "20px" }}>
          <Scatter
            data={data}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </Flex>
      )}
    </div>
  );
}

export default LinearRegressionChart;
