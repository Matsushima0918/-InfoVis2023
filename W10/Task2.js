d3.csv("https://Matsushima0918.github.io/-InfoVis2023/W10/task2.csv")

    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

     var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:30, right:30, bottom:60, left:60}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:30, right:30, bottom:60, left:60}
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
            .range([0, self.inner_width]);
      
        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height])
            //.paddingInner(0.1);
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6)
      
        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6)
        self.xaxis_group = self.chart.append('g')
        .attr('transform', `translate(0, ${self.inner_height})`)
        //.call( self.xaxis );
    
        self.yaxis_group = self.chart.append('g')
        .attr('transform', `translate(0, 0)`)
        //.call( self.yaxis );
            
    }

    update() {

            let self = this;

            const xmin = d3.min( self.data, d => d.x );
            const xmax = d3.max( self.data, d => d.x );
            self.xscale.domain( [xmin, xmax] );
    
            const ymin = d3.min( self.data, d => d.y );
            const ymax = d3.max( self.data, d => d.y );
            self.yscale.domain( [ymax, ymin] );


            self.render();

    }
    render() {
        let self = this;
        //d3.select('#drawing_region');

        self.chart.selectAll("circle").data(self.data)
            .enter()
            .append('circle')
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });
            
            self.xaxis_group
            .call( self.xaxis );

            self.yaxis_group
            .call( self.yaxis );   

    }
}
