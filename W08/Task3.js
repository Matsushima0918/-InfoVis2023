d3.csv("https://Matsushima0918.github.io/-InfoVis2023/W04/task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
     var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: 256,
            margin: {top:30, right:30, bottom:30, left:60}
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });
class PieChart {
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: config.radius || Math.min( width, height ) / 2,
            margin: config.margin || {top:10, right:10, bottom:20, left:60}
        }
        this.data = data;
        this.init();
    }
    init() {
        let self = this;
        self.svg = d3.select('#drawing_region')
        .attr('width', self.config.width)
        .attr('height', self.config.height)
        .append('g')
        .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.pie = d3.pie()
        .value( d => d.value );

        self.arc = d3.arc()
        .innerRadius(0)
        .outerRadius(self.radius);
    }
    update() {
        let self = this;
        self.render();
    }
    render() {
        let self = this;

        self.svg.selectAll('pie')
        .data( self.pie(self.data) )
        .enter()
        .append('path')
        .attr('d', self.arc)
        .attr('fill', 'black')
        .attr('stroke', 'white')
        .style('stroke-width', '2px');


    }
}
