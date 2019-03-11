const socket = io("https://red-carpet-api.herokuapp.com/charts");
// let data = {};
let chartData = {};
let charts = {};
let pieCharts = [];
let owlCarouselTemplate = $("#owl-carousel-template").html();
let compiledTemplate = Handlebars.compile(owlCarouselTemplate);

const setData = (votes) => {
    chartData = {
        chart: votes
    };

    let generatedHTML = compiledTemplate(chartData);
    $("#owl-carousel-container").html(generatedHTML);
    charts = chartData.chart.map((data, index) => {
        return {
            el: $("#cat" + index),
            data: data.votes.sort(function (a, b) {
                return a > b ? 1 : -1;
            })
        }
    });
    pieCharts = charts.map(function (e) {
        return new Chart(e.el, {
            type: 'doughnut',
            data: {
                datasets: [{
                    label: "# of votes",
                    data: e.data,
                    backgroundColor: [
                        'rgba(246, 83, 20, 1)',
                        'rgba(0, 161, 241, 1)',
                        'rgba(255, 187 , 0, 1)',
                        'rgba(124, 187, 0, 1)'
                    ],
                    borderColor: [
                        'rgba(0,0,0,1)',
                        'rgba(0,0,0, 1)',
                        'rgba(0,0,0, 1)',
                        'rgba(0,0,0, 1)'
                    ]
                }],
            },
            options: {
                rotation: Math.PI,
                responsive: true,
                tooltips: false,
                responsiveAnimationDuration: 0,
                maintainAspectRatio: true,
                animation: {
                    animateRotate: false
                }
            }
        });
    });

};

socket.on('init', (votes) => {
    console.log(data)
    let category = votes.map(function (cat) {
        const result = data.categories.find(function (c) {
            return c._id === cat.categoryId;
        });
        if (result) {
            return {...cat, name: result.title, nominees: result.nominees};
        }
        else
            return cat;
    });

    setData(category);
    $(".owl-carousel").owlCarousel({
        responsive: {
            autoHeight: true,
            autoWidth: true
        },
        lazyLoad: true,
        dots: true,
        nav: true,
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 7000,
        paginationNumbers: true
    });
});

socket.on('vote', (votes) => {
    // console.log(votes);
    updateData(pieCharts, votes);
});


const updateData = (pieCharts, votes) => {
    chartData = {
        chart: votes
    };

    charts = chartData.chart.map((data, index) => {

        return {
            el: $("#cat" + index),
            data: data.votes
        }
    });
    // console.log(charts)
    for (let i = 0; i < pieCharts.length; i++) {
        pieCharts[i].data.datasets[0].data = charts[i].data.sort(function (a, b) {
            return a > b ? 1 : -1;
        });
        pieCharts[i].update();
    }

};
