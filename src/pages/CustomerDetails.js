import React, {Component} from 'react'
import {Table, Alert, Card, CardTitle, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Container, Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem } from 'reactstrap';
import {GetCustomerById, GetApplicationsByCustomerId, UpdateCallLog, GetAllStatus, CreateApplication, UpdateApplication, GetCallLogsByCustomerId, GetStatisticsByCustomerId} from '../utilities/axiosUtility'
import {formatADateAndTime} from '../utilities/dateUtility'
import {toast} from 'react-toastify'
import ChartWidget from '../widgets/ChartWidget'

class CustomerDetails extends Component {

constructor(props){
    super(props)

}


state = {
    customer: {
        id: 0,
        name: ""
    },
    applications: [],
    calls: [],
    stats: [],
    statusList: [],
    statusDropdownId: 0,
    statusFilterDropdownOpen: false,
    pieClosedCalls: [],
    filteredCalls: [],
    applicationInfo: {
        name: "",
        description: "",
        hasSupportContract: false,
        id: 0,
      },
    applicationModalOpen: false,
}

componentDidMount(){
this.getAllCustomerDataById(this.props.match.params.id);
}

//Toggles applications details modal
toggleApplicationModal = () => {
    this.setState({applicationModalOpen: !this.state.applicationModalOpen})
  }

//depending on if a application has been selected, the function will update or create an application.
  newOrUpdateApplication = () => {
    if(this.state.applicationInfo.id === 0)
    {
    var applicationPostData = {
        name: this.state.applicationInfo.name,
        description: this.state.applicationInfo.description,
        hasSupportContract: this.state.applicationInfo.hasSupportContract,
        customerId: this.state.customer.id
      }
      CreateApplication(applicationPostData).then(response => {
        var applications = this.state.applications;
        applications.push(response.data)
        toast.success("Application Created")
        var clearApplicationDetails = {
            name: "",
            description: "",
            hasSupportContract: false,
            id: 0,
          }
        this.setState({applications: applications, applicationInfo: clearApplicationDetails}, this.toggleApplicationModal())
      })
    }
    else
    {
        var applicationPutData = {
            applicationId: this.state.applicationInfo.id,
            name: this.state.applicationInfo.name,
            description: this.state.applicationInfo.description,
            hasSupportContract: this.state.applicationInfo.hasSupportContract,
        }

        UpdateApplication(applicationPutData).then(response => {
            if(response.status == "OK")
            {
            var applications = this.state.applications;
            applications.map((application, id) => {
                if(application.id === response.data.id)
                {
                    applications[id] = response.data
                }
            })
            toast.success("Application Updated")
            this.setState({applications: applications}, this.toggleApplicationModal())
            }
        }).catch(error => {
            toast.warn("Error Updating")
        })
    }
  }

//Gets all data avaiable for a customer and sets to state.
getAllCustomerDataById = async(id) =>{

    var applicationRes = await GetApplicationsByCustomerId(id);
    var callLogsRes = await GetCallLogsByCustomerId(id);
    var statRes = await GetStatisticsByCustomerId(id);
    var statusRes = await GetAllStatus();

    if(applicationRes.status === "OK")
    {
      this.setState({customer: applicationRes.data[0].customer, applications: applicationRes.data})
    }

    if(callLogsRes.status === "OK")
    {
        this.setState({ calls: callLogsRes.data, filteredCalls: callLogsRes.data})
    }

    if(statRes.status === "OK")
    {
        var pieClosedCalls = [
        {name: "Total Calls", value: statRes.data.closedCalls.totalCalls},
        {name: "Satisfactory", value: statRes.data.closedCalls.satisfactory},
        {name: "Unstatisfactory", value: statRes.data.closedCalls.unsatisfactory}
        ]
        this.setState({stats: statRes.data, pieClosedCalls: pieClosedCalls})
    }

    if(statusRes.status === "OK")
    {
        this.setState({statusList: statusRes.data})
    }

}

//Calls GetCustomerById endpoint and stores results in state.
getCustomerById = async (id) => {
    var customerRes = await GetCustomerById(id)
    if(customerRes.status === "OK")
    {
        this.setState({customer: customerRes.data})
    }
}

//Sets that current applicationInfo state to the currently selected application.
selectCurrentApplication(id){
    var currentApplication = this.state.applicationInfo;
    currentApplication.id = this.state.applications[id].id
    currentApplication.name = this.state.applications[id].name
    currentApplication.description = this.state.applications[id].description
    currentApplication.hasSupportContract = this.state.applications[id].hasSupportContract

    this.setState({applicationInfo: currentApplication}, this.toggleApplicationModal())
}

//Updates an applicationInfo field dependent on event.target.name.
onChangeApplicationDetails = (event) => {
    var tempApplicationInfo = {...this.state.applicationInfo}
    if(event.target.type === "checkbox")
    {
      tempApplicationInfo[event.target.name] = event.target.checked
    }
    else
    {
      tempApplicationInfo[event.target.name] = event.target.value
    }
    this.setState({applicationInfo: tempApplicationInfo})
   }
  
//Sets status to a call with given parameters, will notify on succes or error.
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
            this.setState({calls: callsLogs, filteredCalls: callsLogs})
            toast.success("Status Changed To " + response.data.status.description )
        }
        else
        {
            toast.error("Error Changing Status")
        }
    })
}

//Renders the applications state array into a table, with the ability to view applications details in a modal, or create a new application.
renderApplicationTable(){
    return(
        <Card>
            <CardBody style={{overflow: 'scroll', height: 760}}>
                <CardTitle style={{width: '100%', textAlign: 'center', fontSize: 25}}>Applications <Button onClick={this.toggleApplicationModal} style={{float: 'right'}} size="sm" color="primary">New</Button></CardTitle>
                <Table hover style={{fontSize: 13}}>
                    <thead>
                        <tr>
                            <th>Application</th>
                            <th>Install Date</th>
                            <th>Has Support Contract</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody >
                        {this.state.applications.map((application, id) => {
                            return(
                                <tr key={id}>
                                    <td>{application.name}</td>
                                    <td>{formatADateAndTime(application.installationDate)}</td>
                                    <td>{application.hasSupportContract === true ? "True" : "False"}</td>
                                    <td><Button onClick={() => this.selectCurrentApplication(id)} size="sm" color="primary">View</Button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table> 
            </CardBody>
       </Card>
    )
}

//toggles Status dropdown for calls table
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

//Toggles Filter dropdown for calls status
toggleFilterStatusDropdown = () => {
        this.setState({statusFilterDropdownOpen: !this.state.statusFilterDropdownOpen})
}

//Filters through calls array 
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

//Renders the Calls table, using Button dropdowns for both filtering and setting a status.
renderCallsTable(){
    return(
        <Card>
            <CardBody style={{overflow: 'scroll', height: 760}}>
                <CardTitle style={{width: "100%", textAlign: 'center', fontSize: 25 }}>Calls</CardTitle>
                <Table  hover style={{fontSize: 13}}>
                    <thead>
                        <tr>
                            <th>Application</th>
                            <th>Description</th>
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
                                    <tr key={callArrayId}>
                                        <td>{call.application.name}</td>
                                        <td>{call.description}</td>
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
                                                        <DropdownItem id={statusArrayId} onClick={() => this.setStatusOfCall(call.id, status.id, callArrayId)}>{status.description}</DropdownItem>
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
    )
}

render(){
    const modalTitleHeader = this.state.applicationInfo.id === 0 ? "New Application" : "Edit Application";
    
    return(
        <div>
            <Label style={{width: "100%", textAlign: "center", fontSize: 40}}>{this.state.customer.name}</Label>
            <Row style={{margin: 5}}>
                <Col xs={4}>
                    {this.renderApplicationTable()}
                </Col>
                <Col xs={4}>
                    {this.renderCallsTable()}
                </Col>
                <Col>
                    <Row style={{paddingBottom: 40}}>
                    <ChartWidget width={200} height={300} title="Open Calls" data={[this.state.stats.openCalls]} labelOne="Total Calls" labelTwo="Responded" labelThree="Awaiting Response" dataKeyOne="totalCalls" dataKeyTwo="responded" dataKeyThree="awaitingResponse" />
                    <ChartWidget chartType="Pie" width={200} height={300} title="Closed Calls" data={this.state.pieClosedCalls} labelOne="Total Calls" labelTwo="Satisfactory" labelThree="Unsatisfactory" dataKeyOne="totalCalls" dataKeyTwo="satisfactory" dataKeyThree="unsatisfactory" />
                    </Row>
                    <ChartWidget  width={200} height={300} title="Last 3 Months" data={[this.state.stats.lastThreeMonths]} labelOne="Month 1" labelTwo="Month 2" labelThree="Month 3" dataKeyOne="month1" dataKeyTwo="month2" dataKeyThree="month3" />
                </Col>
            </Row>
            <Modal isOpen={this.state.applicationModalOpen} toggle={this.toggleApplicationModal}>
                <ModalHeader toggle={this.toggleApplicationModal}>{modalTitleHeader}</ModalHeader>
                <ModalBody>
                    <Form>
                    <FormGroup>
                        <Label for="newApplicationName" sm={2}>Name</Label>
                        <Input onChange={e => this.onChangeApplicationDetails(e)} value={this.state.applicationInfo.name} name="name" id="newApplicationName" placeholder="Application Name" />
                        <Label for="newApplicationDescription" sm={2}>Description</Label>
                        <Input onChange={e => this.onChangeApplicationDetails(e)} value={this.state.applicationInfo.description} name="description" id="newApplicationDescription" placeholder="Application Description" />
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                        <Input onChange={e => this.onChangeApplicationDetails(e)} type="checkbox" name="hasSupportContract" checked={this.state.applicationInfo.hasSupportContract} />{' '}
                        Has Support Contract
                        </Label>
                    </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter> 
                    <Button color="primary" onClick={this.newOrUpdateApplication}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggleApplicationModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}


}

export default CustomerDetails