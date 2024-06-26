document.addEventListener('DOMContentLoaded', () => {
    // WebSocket client
    const socket = new WebSocket('ws://localhost:6789');

    socket.onmessage = function(event) {
        const data = event.data.split(',');
        const countA = parseInt(data[0]);
        const countB = parseInt(data[1]);
        const avgDurationA = isNaN(parseFloat(data[2])) ? 0 : parseFloat(data[2]).toFixed(2);
        const avgDurationB = isNaN(parseFloat(data[3])) ? 0 : parseFloat(data[3]).toFixed(2);
        const totalCount = countA + countB;

        // Update the dashboard with the new counts and durations
        document.getElementById('polygon-a-count').innerHTML = `<div class="count">${countA}</div><div class="label">Polygon A</div>`;
        document.getElementById('polygon-b-count').innerHTML = `<div class="count">${countB}</div><div class="label">Polygon B</div>`;
        document.getElementById('total-count').innerHTML = `<div class="count">${totalCount}</div><div class="label">Total Count</div>`;

        // Update the pie chart
        const chart = Chart.getChart('people-counting-chart');
        chart.data.datasets[0].data = [countA, countB];
        chart.update();

        // Update the average duration dashboard
        const avgDurationAElement = document.getElementById('average-polygon-a-duration');
        const avgDurationBElement = document.getElementById('average-polygon-b-duration');
        if (avgDurationAElement && avgDurationBElement) {
            avgDurationAElement.innerHTML = `<div class="count">${avgDurationA} s</div><div class="label">Avg Duration A</div>`;
            avgDurationBElement.innerHTML = `<div class="count">${avgDurationB} s</div><div class="label">Avg Duration B</div>`;
        }

        // Update the average duration chart
        const avgDurationChart = Chart.getChart('average-duration-chart');
        avgDurationChart.data.datasets[0].data = [avgDurationA, avgDurationB];
        avgDurationChart.update();
    };

    // Handle active state for navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Create Pie Chart for People Counting
    const ctxPeopleCounting = document.getElementById('people-counting-chart').getContext('2d');
    new Chart(ctxPeopleCounting, {
        type: 'doughnut',
        data: {
            labels: ['Polygon A', 'Polygon B'],
            datasets: [{
                data: [0, 0],  // Initial data
                backgroundColor: ['#36A2EB', '#FF6384'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold'
                    },
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    }
                }
            }
        }
    });

    // Populate Average Duration Data
    document.getElementById('average-polygon-a-duration').innerHTML = '<div class="count">0 s</div><div class="label">Polygon A</div>';
    document.getElementById('average-polygon-b-duration').innerHTML = '<div class="count">0 s</div><div class="label">Polygon B</div>';

    // Create Pie Chart for Average Duration
    const ctxAverageDuration = document.getElementById('average-duration-chart').getContext('2d');
    new Chart(ctxAverageDuration, {
        type: 'doughnut',
        data: {
            labels: ['Polygon A', 'Polygon B'],
            datasets: [{
                data: [0, 0],  // Initial data
                backgroundColor: ['#36A2EB', '#FF6384'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                },
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold'
                    },
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value * 100 / sum).toFixed(2) + "%";
                        return percentage;
                    }
                }
            }
        }
    });
});
