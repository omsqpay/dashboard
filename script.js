
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#transactionsTable tbody');
  const searchInput = document.getElementById('search');
  const statusFilter = document.getElementById('statusFilter');
  const merchantFilter = document.getElementById('merchantFilter');

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

  function updateSummary(data) {
    document.getElementById('totalTx').textContent = `Всего транзакций: ${data.length}`;
    const totalSum = data.reduce((acc, row) => acc + row['Sum'], 0).toFixed(2);
    document.getElementById('totalSum').textContent = `Общая сумма: ${totalSum} USD`;
    const suspicious = data.filter(r => r['Ip'] === '91.193.111.216' || r['User id'] === 471789);
    document.getElementById('alerts').textContent = `Подозрительных записей: ${suspicious.length}`;
  }

  function filterData() {
    const term = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const merchant = merchantFilter.value;
    const filtered = sampleData.filter(row => {
      return (!status || row['Status'] === status) &&
             (!merchant || row['Merchant'] === merchant) &&
             Object.values(row).some(v => v?.toString().toLowerCase().includes(term));
    });
    renderTable(filtered);
    updateChart(filtered);
    updateSummary(filtered);
  }

  searchInput.addEventListener('input', filterData);
  statusFilter.addEventListener('change', filterData);
  merchantFilter.addEventListener('change', filterData);

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
  updateSummary(sampleData);
});
