//SHOW Statisics
import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import {GetAllCustomers, GetStatisticsByCustomerId} from '../utilities/axiosUtility'
import ChartWidget from '../widgets/ChartWidget'

class Dashboard extends Component {

constructor(){
    super()
}

state = {
    stats: [],
    customers: [],
    openCalls: [],
    closedCalls: [],
    lastThreeMonths: [],
}

componentDidMount(){
this.getStatistics()
}


//Gets All Stats By All Customers and passes to buildStatistics function.
getStatistics(){
    GetAllCustomers().then(async(response) => {
        const statList = await Promise.all(response.data.map(async (customer, id) => {
           var statResponse = await GetStatisticsByCustomerId(customer.id)
           if(statResponse.status == "OK")
           {
           return statResponse.data
           }
        }))
    this.buildStatistics(statList, response.data);
    })
}

//Builds 3 Stats Arrays for use in Chartwidget
buildStatistics(stats, customers){
    var tempOpenCalls = stats.map((stat, id) => {
        var call = {
            customerName: stat.customer.name,
            totalCalls: stat.openCalls.totalCalls,
            responded: stat.openCalls.responded,
            awaitingResponse: stat.openCalls.awaitingResponse
        }

        return call
    })

    var tempClosedCalls = stats.map((stat, id) => {
        var call = {
            customerName: stat.customer.name,
            totalCalls: stat.closedCalls.totalCalls,
            satisfactory: stat.closedCalls.satisfactory,
            unsatisfactory: stat.closedCalls.unsatisfactory
        }

        return call
    })

    var tempLastThreeMonths = stats.map((stat, id) => {
        var call = {
            customerName: stat.customer.name,
            month1: stat.lastThreeMonths.month1,
            month2: stat.lastThreeMonths.month2,
            month3: stat.lastThreeMonths.month3
        }

        return call
    })

    this.setState({openCalls: tempOpenCalls, closedCalls: tempClosedCalls, lastThreeMonths: tempLastThreeMonths, stats: stats, customers: customers})
}

render()
{
    return(
        <Container style={{padding: 10, }}>
            <Row >
                <ChartWidget  width={500} height={350} title="Open Calls" data={this.state.openCalls} labelOne="Total Calls" labelTwo="Responded" labelThree="Awaiting Response" dataKeyOne="totalCalls" dataKeyTwo="responded" dataKeyThree="awaitingResponse" />
                <ChartWidget width={500} height={350} title="Closed Calls" data={this.state.closedCalls} labelOne="Total Calls" labelTwo="Satisfactory" labelThree="Unsatisfactory" dataKeyOne="totalCalls" dataKeyTwo="satisfactory" dataKeyThree="unsatisfactory" />
                <ChartWidget chartType="Line" width={500} height={350} title="Last 3 Months" data={this.state.lastThreeMonths} labelOne="Month 1" labelTwo="Month 2" labelThree="Month 3" dataKeyOne="month1" dataKeyTwo="month2" dataKeyThree="month3" />
            </Row>
        </Container>
    )
}




}
export default Dashboard