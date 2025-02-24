const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const report = require('./mocha-reports/report.json');  // Path to your Mochawesome JSON report file

let passedTests = 0;
let failedTests = 0;

// Loop through the results and count passed/failed tests
report.results.forEach(result => {
  result.suites.forEach(suite => {
    suite.tests.forEach(test => {
      if (test.state === 'passed') passedTests++;
      if (test.state === 'failed') failedTests++;
    });
  });
});

console.log('Passed Tests:', passedTests);
console.log('Failed Tests:', failedTests);

// Path to the JSON report
const jsonReportPath = path.join(__dirname, "mocha-reports", "report.json");

// Path to save the PDF
const pdfOutputPath = path.join(__dirname, "styled-summary-report-with-chart.pdf");

fs.readFile(jsonReportPath, "utf-8", async (err, jsonData) => {
  if (err) {
    console.error("Error reading JSON report:", err);
    return;
  }

  const report = JSON.parse(jsonData);
  const stats = report.stats;
  const totalTests = stats.tests;
  const passedTests = stats.passes;
  const failedTests = stats.failures;

  let serialNumber = 1;

  const testDetails = report.results
    .flatMap((suite) =>
      suite.suites.flatMap((subSuite) =>
        subSuite.tests.map((test) => {
          const statusColor =
            test.state === "passed"
              ? "style='color: green;'"
              : test.state === "failed"
              ? "style='color: red;'"
              : "";

          return `
            <tr>
              <td>${serialNumber++}</td>
              <td>${subSuite.title}</td>
              <td>${test.title}</td>
              <td ${statusColor}>${test.state}</td>
              <td>${test.duration}</td>
            </tr>
          `;
        })
      )
    )
    .join("");
  const passedPercentage = (passedTests / totalTests) * 100;
  const failedPercentage = (failedTests / totalTests) * 100;
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Test Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
      body { font-family: Arial, sans-serif; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      canvas { display: block; margin: 20px auto; }
    </style>
  </head>
  <body>
    <h1>Test Report</h1>
    <canvas id="testChart" width="400" height="400"></canvas>
    <script>
      const ctx = document.getElementById('testChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Passed', 'Failed'],
          datasets: [{
            data: [${passedPercentage.toFixed(2)}, ${failedPercentage.toFixed(2)}],  // Use percentages, not raw counts
            backgroundColor: ['#28a745', '#dc3545'],  // Green for Passed, Red for Failed
            hoverBackgroundColor: ['#28a745', '#dc3545']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          }
        }
      });
    </script>
    <h2>Test Results Summary</h2>
    <p><strong>Total Tests:</strong> ${totalTests}</p>
    <p><strong>Passed Tests:</strong> ${passedTests}</p>
    <p><strong>Failed Tests:</strong> ${failedTests}</p>
    <p><strong>Duration:</strong> ${stats.duration} ms</p>
    <h2>Test Details</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Suite</th>
          <th>Test Case</th>
          <th>Status</th>
          <th>Duration (ms)</th>
        </tr>
      </thead>
      <tbody>
        ${testDetails}
      </tbody>
    </table>
  </body>
  </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: pdfOutputPath, format: "A4" });

  await browser.close();
  console.log("PDF report with pie chart generated at:", pdfOutputPath);
});
