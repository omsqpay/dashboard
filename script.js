
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#transactionsTable tbody');
  const searchInput = document.getElementById('search');
  const statusFilter = document.getElementById('statusFilter');

  function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(row => {
      const tr = document.createElement('tr');
      if (row['Ip'] === '91.193.111.216' || row['User id'] === 471789) {
        tr.classList.add('suspicious');
      }
      tr.innerHTML = `
        <td>${row['Date and time']}</td>
        <td>${row['Sum']}</td>
        <td>${row['Status']}</td>
        <td>${row['User id']}</td>
        <td>${row['Ip']}</td>
        <td>${row['Merchant']}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function filterData() {
    const term = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const filtered = sampleData.filter(row => {
      return (!status || row['Status'] === status) &&
             Object.values(row).some(v => v?.toString().toLowerCase().includes(term));
    });
    renderTable(filtered);
    updateChart(filtered);
  }

  searchInput.addEventListener('input', filterData);
  statusFilter.addEventListener('change', filterData);

  function updateChart(data) {
    const counts = data.reduce((acc, row) => {
      acc[row.Status] = (acc[row.Status] || 0) + 1;
      return acc;
    }, {});
    const chartData = {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Transactions',
        data: Object.values(counts),
        backgroundColor: ['#34d399', '#f87171', '#fbbf24'],
      }]
    };
    if (window.statusChart) {
      window.statusChart.data = chartData;
      window.statusChart.update();
    } else {
      const ctx = document.getElementById('statusChart');
      window.statusChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }

  renderTable(sampleData);
  updateChart(sampleData);
});
