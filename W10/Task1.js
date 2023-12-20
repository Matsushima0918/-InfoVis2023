d3.csv("https://Matsushima0918.github.io/-InfoVis2023/W04/task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
     var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:30, right:30, bottom:30, left:60}
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {
    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:30, right:30, bottom:30, left:60}
        }
        this.data = data;
        this.init();
    }
    init() {
        let self = this;
        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.width)])
            .range([0, self.inner_width]);
      
        self.yscale = d3.scaleBand()
            .domain(self.data.map(d => d.name))
            .range([0, self.inner_height])
            .paddingInner(0.1);
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);
      
        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);
        self.xaxis_group = self.chart.append('g')
        .attr('transform', `translate(0, ${self.inner_height})`)
        .call( self.xaxis );
    
        self.yaxis_group = self.chart.append('g')
        .call( self.yaxis );
    }
    update() {
        let self = this;
        d3.selectAll('#reverse')
            .on('click', d => {
            self.data.reverse();
        })
        self.render();


    }
    render() {
        let self = this;
        self.chart.selectAll("rect").data(self.data)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => self.yscale(d.name))
        .attr("width", d => self.xscale(d.width))
        .attr("height", self.yscale.bandwidth())
        //.attr("fill", d=> d.color );


    }
}
