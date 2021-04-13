import React, {Component} from 'react'
import {GetAllCustomers,  UpdateCallLog, GetCallLogsByCustomerId, GetAllStatus} from '../utilities/axiosUtility'
import {Table, Container, Card, CardTitle, CardBody, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, TabContent} from 'reactstrap';
import {toast} from 'react-toastify'

class Calls extends Component {

constructor(props){
    super()
}

state = {
    calls: [],
    filteredCalls: [],
    callsTableData: [],
    statusList: [],
    statusDropdownId: 0,
    statusFilterDropdownOpen: false
}

componentDidMount(){
this.getAllCalls()
}

toggleStatusDropdown = (id) => {
    if(this.state.statusDropdownId == id)
    {
        this.setState({statusDropdownId: 0})
    }
    else
    {
        this.setState({statusDropdownId: id})
    }
}

toggleFilterStatusDropdown = () => {
    this.setState({statusFilterDropdownOpen: !this.state.statusFilterDropdownOpen})
}

filterByStatus = (status) => {
    if(status == "All")
    {
        this.setState({filteredCalls: this.state.calls})
    }
    else
    {
    var filteredStatus = this.state.calls.filter(calls => calls.status.description == status)
    this.setState({filteredCalls: filteredStatus})
    }
}

getAllCalls(){
    GetAllCustomers().then(async(response) => {
        const callList = await Promise.all(response.data.map(async (customer, id) => {
           var callResponse = await GetCallLogsByCustomerId(customer.id)
           if(callResponse.status == "OK")
           {
           return callResponse.data
           }
        }))

        const statusResponse = await GetAllStatus()
        if(statusResponse.status == "OK")
        {
            this.setState({statusList: statusResponse.data})
        }
    this.buildCallsTableData(callList, response.data);
    })
}

setStatusOfCall(callId, status, callsArrayId){
    var patchData = {
        callId: callId,
        status: status
    }

    UpdateCallLog(patchData).then(response => {
        if(response.status === "OK")
        {
        var callsLogs = this.state.calls
        callsLogs[callsArrayId] = response.data;
        this.setState({calls: callsLogs})
        toast.success("Status Changed To " + response.data.status.description )
        }
        else
        {
        toast.error("Error Changing Status")
        }
    })
}

buildCallsTableData(callList, customers)
{
    var totalCalls = []
    callList.map((calls, id) => {
        totalCalls = totalCalls.concat(calls) 
    })

    var tableData = totalCalls.map((call, id) => {
        var record = {
            callId: call.id,
            applicationName: call.application.name,
            description: call.description,
            customerName: call.customer.name,
            status: 
            <div>
                {call.status.description}
                <ButtonDropdown isOpen={this.state.statusDropdownId == call.id ? true : false} toggle={() => this.toggleStatusDropdown(call.id)}>
                    <DropdownToggle caret>
                        {call.status.description}
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.state.statusList.map((status, id) => {
                            return(
                                <DropdownItem>{status.description}</DropdownItem>
                            )
                        })}
                    </DropdownMenu>
                </ButtonDropdown>
            </div>
        }
        return record
    })
    this.setState({callsTableData: tableData, calls: totalCalls, filteredCalls: totalCalls})
}


render(){
    var callTitles = ["Application", "Description", "Customer Name", "Status"]
    var colNames = ["applicationName", "description", "customerName", "status"]


    return(
        <Container style={{padding: 30}}>
            <Card style={{width: 900}}>
                <CardBody style={{overflow: 'scroll', height: 760}}>
                    <CardTitle style={{width: "100%", textAlign: 'center', fontSize: 27, }}>Calls</CardTitle>
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Application</th>
                                <th>Description</th>
                                <th>Customer Name</th>
                                <th>Status
                                <ButtonDropdown style={{paddingLeft: 5}} isOpen={this.state.statusFilterDropdownOpen} toggle={() => this.toggleFilterStatusDropdown()}>
                                <DropdownToggle caret size="sm">
                                Filter Status
                                </DropdownToggle>
                                <DropdownMenu>
                                    {this.state.statusList.map((status, statusArrayId) => {
                                    
                                        return(
                                            <DropdownItem id={statusArrayId} onClick={() => this.filterByStatus(status.description)}>{status.description}</DropdownItem>
                                        )
                                        
                                    })}
                                    <DropdownItem  onClick={() => this.filterByStatus("All")}>All</DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                                </th>
                            </tr>
                        </thead>
                        <tbody> 
                                {this.state.filteredCalls.map((call, callArrayId) => {
                                    return(
                                        <tr>
                                            <td>{call.application.name}</td>
                                            <td>{call.description}</td>
                                            <td>{call.customer.name}</td>
                                            <td>   
                                            <ButtonDropdown isOpen={this.state.statusDropdownId == call.id ? true : false} toggle={() => this.toggleStatusDropdown(call.id)}>
                                                <DropdownToggle caret>
                                                {call.status.description}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    {this.state.statusList.map((status, statusArrayId) => {
                                                        if(status.description === call.status.description)
                                                        {
                                                            
                                                        }
                                                        else
                                                        {
                                                        return(
                                                            <DropdownItem onClick={() => this.setStatusOfCall(call.id, status.id, callArrayId)}>{status.description}</DropdownItem>
                                                        )
                                                        }
                                                    })}
                                                </DropdownMenu>
                                            </ButtonDropdown>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </Container>
    )
}



}

export default Calls