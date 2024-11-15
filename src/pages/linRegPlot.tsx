import React, { useState } from "react";
import { Button, Flex } from "antd";

function LinearRegressionPlot() {
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
  const [chartImage, setChartImage] = useState<string | undefined>(undefined);

  const runPythonCode = async () => {
    const pyodide = await (window as any).loadPyodide();
    await pyodide.loadPackage("numpy");
    await pyodide.loadPackage("matplotlib");
    await pyodide.loadPackage("pandas");
    await pyodide.loadPackage("scikit-learn");

    const pythonCode = `
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import io
import base64

# Ваши данные
origpm25 = np.array(${JSON.stringify(pm25)});
origcov = np.array(${JSON.stringify(cov)});

# Подготовка данных
X = origpm25.reshape(-1, 1)
y = origcov

# Создание модели
model = LinearRegression()
model.fit(X, y)

# Предсказание
predictions = model.predict(X)

# Визуализация
plt.figure(figsize=(10, 6))
plt.scatter(origpm25, origcov, color='blue', label='Data Points')
plt.plot(origpm25, predictions, color='red', linewidth=2, label='Regression Line')
plt.xlabel('PM2.5')
plt.ylabel('COVID')
plt.legend()
plt.title('Linear Regression of PM2.5 vs COVID Data')

# Сохранение графика в изображение
buf = io.BytesIO()
plt.savefig(buf, format='png')
buf.seek(0)
image = base64.b64encode(buf.read()).decode('utf-8')
image
`;

    const imageBase64 = await pyodide.runPythonAsync(pythonCode);
    setChartImage(`data:image/png;base64,${imageBase64}`);
    setShowChart(true);
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
    setChartImage(undefined);
    setShowChart(false);
  };

  return (
    <div style={{ width: "60%", margin: "0 auto" }}>
      <h1>Лин Рег Визуализация</h1>
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
          <Button onClick={runPythonCode}>Показать график</Button>
          <Button onClick={handleReset}>Сбросить к дефолтным значениям</Button>
        </Flex>
      </Flex>

      {showChart && (
        <div style={{ width: "100%", height: "600px", marginTop: "20px" }}>
          <img src={chartImage} alt="Linear Regression Chart" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default LinearRegressionPlot;
