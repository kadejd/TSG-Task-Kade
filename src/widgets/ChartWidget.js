import React, { PureComponent } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {RadarChart, Radar, PieChart, Pie, ScatterChart, Scatter, LineChart, Line, AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Label, Container, Card, CardTitle, CardBody} from 'reactstrap'



const COLORS = ['#0088FE', '#00C49F', '#FF5C33'];

const RADIAN = Math.PI / 180;

//used for filling text to pie area.
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


class ChartWidget extends PureComponent {

constructor(props){
    super(props)

}

//render specific chart type on given prop, default is bar chart.
renderChartType(){
  switch(this.props.chartType){
    case "Bar": return this.barChart()
    break;
    case "Line": return this.lineChart()
    break;
    case "Area": return this.areaChart()
    break;
    case "Pie": return this.pieChart()
    break;
    case "Scatter": return this.scatterChart()
    break;
  default: return this.barChart()
    
  }
}




pieChart(){
  return(
    <PieChart
    width={this.props.width}
    height={this.props.height}
    data={this.props.data}
    >
      <Pie
              data={this.props.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {this.props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
      <Tooltip />
      <Legend  />
    </PieChart>
  )
}

areaChart(){
  return(
    <AreaChart
    width={this.props.width}
    height={this.props.height}
    data={this.props.data}
      margin={{
          top: 10,
          bottom: 0,
          left: 0,
          right: 0
      }}
  
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis style={{fontSize: 6}} dataKey="customerName" />
    <YAxis />
    <Tooltip />
    <Legend  />
    <Area name={this.props.labelOne} type="monotone"   dataKey={this.props.dataKeyOne} fill="#e60000" />
    <Area name={this.props.labelTwo}  type="monotone"   dataKey={this.props.dataKeyTwo} fill="#82ca9d" />
    <Area name={this.props.labelThree}  type="monotone"   dataKey={this.props.dataKeyThree} fill="#8884d8" />
  </AreaChart>
  )
}

lineChart() {
  
  return(
    <LineChart
    width={this.props.width}
    height={this.props.height}
    data={this.props.data}
      margin={{
          top: 10,
          bottom: 0,
          left: 0,
          right: 0
      }}
  
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis  style={{fontSize: 6 }} dataKey="customerName" />
    <YAxis />
    <Tooltip />
    <Legend  />
    <Line name={this.props.labelOne} type="monotone" dataKey={this.props.dataKeyOne} fill="#8884d8" />
    <Line name={this.props.labelTwo} type="monotone"  dataKey={this.props.dataKeyTwo} fill="#82ca9d" />
    <Line name={this.props.labelThree} type="monotone"  dataKey={this.props.dataKeyThree} fill="#ff5c33" />
  </LineChart>
  )
}

barChart () {
return(
  <BarChart
  width={this.props.width}
  height={this.props.height}
  data={this.props.data}
    margin={{
        top: 10,
        bottom: 0,
        left: 0,
        right: 0
    }}

>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis style={{fontSize: 6 }} dataKey="customerName" />
  <YAxis />
  <Tooltip />
  <Legend  />
  <Bar name={this.props.labelOne}   dataKey={this.props.dataKeyOne} fill="#8884d8" />
  <Bar name={this.props.labelTwo}     dataKey={this.props.dataKeyTwo} fill="#82ca9d" />
  <Bar name={this.props.labelThree}     dataKey={this.props.dataKeyThree} fill="#ff5c33" />
</BarChart>
)
}


render() {
    return (
        <Container style={{width: this.props.width + 60, borderRadius: 3, border: "1px solid lightgrey", paddingBottom: 5, marginBottom: 5}}>
        <Label style={{textAlign: 'center', fontSize: 20, width: "100%", marginTop: 10}}>{this.props.title}</Label>
        {this.renderChartType()}
        </Container>
    );
  }

}

export default ChartWidget