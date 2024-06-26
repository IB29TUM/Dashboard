document.addEventListener('DOMContentLoaded', () => {
    // WebSocket client
    const socket = new WebSocket('ws://localhost:6789');

    socket.onmessage = function(event) {
        const counts = event.data.split(',');
        const countA = counts[0];
        const countB = counts[1];

        // Update the dashboard with the new counts
        document.getElementById('polygon-a-count').innerHTML = `<div class="count">${countA}</div><div class="label">Polygon A</div>`;
        document.getElementById('polygon-b-count').innerHTML = `<div class="count">${countB}</div><div class="label">Polygon B</div>`;

        // Update the pie chart
        const chart = Chart.getChart('people-counting-chart');
        chart.data.datasets[0].data = [countA, countB];
        chart.update();
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
                        let percentage = (value*100 / sum).toFixed(2)+"%";
                        return percentage;
                    }
                }
            }
        }
    });

    // Populate Average Duration Data
    document.getElementById('average-polygon-a-duration').innerHTML = '<div class="count">12 min</div><div class="label">Polygon A</div>';
    document.getElementById('average-polygon-b-duration').innerHTML = '<div class="count">10 min</div><div class="label">Polygon B</div>';

    // Create Pie Chart for Average Duration
    const ctxAverageDuration = document.getElementById('average-duration-chart').getContext('2d');
    new Chart(ctxAverageDuration, {
        type: 'doughnut',
        data: {
            labels: ['Polygon A', 'Polygon B'],
            datasets: [{
                data: [12, 10],
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
                        let percentage = (value*100 / sum).toFixed(2)+"%";
                        return percentage;
                    }
                }
            }
        }
    });
});
