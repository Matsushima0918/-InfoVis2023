let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

d3.csv("https://Matsushima0918.github.io/-InfoVis2023/Wfinal/Task.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.into = +d.into;
            d.out = +d.out;
        });

         const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
         color_scale.domain(['setosa','versicolor','virginica']);

        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Influx',
            ylabel: 'Efflux',
            cscale: color_scale
        }, input_data );
        scatter_plot.update();

        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Age categories',
            cscale: color_scale
        }, input_data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.prefecture ) );
    }
    scatter_plot.update();
}
