class BarChart {

    constructor(config) {
      this.config = {
        parent: config.parent,
        width: config.width || 256,
        height: config.height || 256,
        margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 }
      }
      this.data = []; // Initialize data as an empty array
      this.init();
    }
  
    init() {
      let self = this;
  
      self.svg = d3.select(self.config.parent)
        .attr('width', self.config.width)
        .attr('height', self.config.height);
  
      self.chart = self.svg.append('g')
        .attr('transform', `translate(${self.config.margin.left},${self.config.margin.top})`);
  
      self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
      self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
  
      self.xscale = d3.scaleLinear()
        .range([0, self.inner_width]);
  
      self.yscale = d3.scaleLinear()
        .range([self.inner_height, 0]);
  
      self.xaxis = d3.axisBottom(self.xscale)
        .ticks(8);
  
      self.xaxis_group = self.chart.append('g')
        .attr('transform', `translate(0, ${self.inner_height})`);
  
      self.yaxis = d3.axisLeft(self.yscale)
        .ticks(6);
  
      self.yaxis_group = self.chart.append('g')
        .attr('transform', 'translate(0, 0)');
  
      // Load data from CSV
      d3.csv("https://Matsushima0918.github.io/-InfoVis2023/W04/task2.csv").then(data => {
        // Parse numeric values
        data.forEach(d => {
          d.x = +d.x;
          d.y = +d.y;
        });
  
        // Set the data and update the chart
        self.data = data;
        self.update();
      });
    }
  
    update() {
      let self = this;
  
      const xmin = d3.min(self.data, d => d.x);
      const xmax = d3.max(self.data, d => d.x);
      self.xscale.domain([xmin, xmax]);
  
      const ymin = 0;
      const ymax = d3.max(self.data, d => d.y);
      self.yscale.domain([ymax, ymin]);
  
      self.render();
    }
  
    render() {
      let self = this;
  
      const padding = 5;
      const height = 20;
  
      self.chart.selectAll("rect")
        .data(self.data)
        .enter()
        .append("rect")
        .attr("x", d => self.xscale(d.x))
        .attr("y", d => self.yscale(d.y))
        .attr("width", self.inner_width / self.data.length - padding)
        .attr("height", d => self.inner_height - self.yscale(d.y))
        .attr("fill", d => d.color);
  
      self.chart.selectAll("text")
        .data(self.data)
        .enter()
        .append("text")
        .text(d => d.name)
        .attr("x", (d, i) => self.xscale(d.x) + (self.inner_width / self.data.length - padding) / 2)
        .attr("y", d => self.yscale(d.y) + 14) // Adjusted y position for text
  
      // Append x-axis
      self.xaxis_group.call(self.xaxis);
  
      // Append y-axis
      self.yaxis_group.call(self.yaxis);
    }
  }
  
  // Example usage:
  const chart = new BarChart({ parent: "body" });