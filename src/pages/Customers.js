import React, {Component} from 'react'
import {GetAllCustomers, GetApplicationsByCustomerId, CreateApplication, GetCallLogsByCustomerId, GetStatisticsByCustomerId} from '../utilities/axiosUtility'
import {Alert, Card, CardTitle, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import {toast} from 'react-toastify';
import {formatADateAndTime} from '../utilities/dateUtility'

class Customers extends Component {

  constructor(props){
    super()
  }

    state = {
        customers: [],
        selectedId: -1,
        selectedApplicationId: -1,
        applicationsVisable: false,
        applicationDetailsVisable: false,
        applications: [],
        applicationInfo: {
          name: "",
          description: "",
          hasSupportContract: false,
        },
        applicationModalOpen: false,
        calls: [],
        callsVisable: false,
        statsVisable: false,
        selectedStats: {}
    }

  

  // Customers
 setCustomers(customersList){
    this.setState({customers: customersList})
 }

 setSelectedCustomer(id){
     this.setState({selectedId: id, applicationDetailsVisable: false}, this.getApplicationsByCustomerId(id))
     this.getCallsByCustomerId(id)
     this.getStatsByCustomerId(id)
 }

 setSelectedApplication(id){
   this.setState({selectedApplicationId: id, applicationDetailsVisable: true})
 }

 getStatsByCustomerId(id){
  GetStatisticsByCustomerId(id).then(response => {
    if(response.status === "No Content")
    {
      this.setState({statsVisable: true})
    }
    else
    {
      this.setState({selectedStats: response.data, statsVisable: true})
    }
  })
 }

 getCallsByCustomerId(id){
  GetCallLogsByCustomerId(id).then(response => {
    if(response.status === "No Content")
    {
      this.setState({callsVisable: true})
    }
    else
    {
      this.setState({calls: response.data, callsVisable: true})
    }
  })
 }

 getApplicationsByCustomerId(id){
    GetApplicationsByCustomerId(id).then(response => {
        if(response.status == "No Content")
        {
        this.setState({applicationsVisable: true})
        }
        else
        {
        this.setState({applications: response.data, applicationsVisable: true})
        }
    })
 }

 componentDidMount(){
    GetAllCustomers().then(response => {
        this.setCustomers(response.data)
      })
 }

 customersTableRender(){
     return(
        <table>
        <tr>
          <th>Customer Name</th>
        </tr>
        <tbody>
        {this.state.customers.map((customer, id) => {
          return(
            <tr>
              <td onClick={() => this.setSelectedCustomer(customer.id)} style={{backgroundColor: this.state.selectedId == customer.id ? "gray" : ""}}>{customer.name}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
     )
 }

 applicationsTableRender(){
    return(
      <div>
        <table>
        <tr>
          <th>Application Name</th>
        </tr>
        <tbody>
        {this.state.applications.map((application, id) => {
          return(
            <tr>
              <td onClick={() => this.setSelectedApplication(id)} style={{backgroundColor: this.state.selectedApplicationId == id ? "gray" : ""}}>{application.name}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
      <Button color="secondary" onClick={this.toggleApplicationModal}>New Application</Button>
    </div>
     )
 }

 callsTableRender(){
   return(
     <div>
       <table>
         <tr>
           <th>Description</th>
           <th>Status</th>
           <th>Customer</th>
           <th>Application</th>
         </tr>
         <tbody>
         {this.state.calls.map((call, id) => {
           return(
           <tr>
             <td>{call.description}</td>
             <td>{call.status.description}</td>
             <td>{call.customer.name}</td>
             <td>{call.application.name}</td>
           </tr>
           )
          })}
         </tbody>
       </table>
     </div>
   )
 }

 statsTableRender(){
const selectedStats = this.state.selectedStats;
return(
  <div>
    Closed Calls
    <table>
      <tr>
        <th>Total Calls</th>
        <th>Satisfactory</th>
        <th>Unsatisfactory</th>
      </tr>
      <tbody>
        <tr>
          <td>{selectedStats.closedCalls.totalCalls}</td>
          <td>{selectedStats.closedCalls.satisfactory}</td>
          <td>{selectedStats.closedCalls.unsatisfactory}</td>
        </tr>
      </tbody>
    </table>
    Open Calls
    <table>
      <tr>
        <th>Total Calls</th>
        <th>Responded</th>
        <th>Awaiting Response</th>
      </tr>
      <tbody>
        <tr>
          <td>{selectedStats.openCalls.totalCalls}</td>
          <td>{selectedStats.openCalls.responded}</td>
          <td>{selectedStats.openCalls.awaitingResponse}</td>
        </tr>
      </tbody>
    </table>
    Last 3 Months
    <table>
    <tr>
        <th>Month 1</th>
        <th>Month 2</th>
        <th>Month 3</th>
      </tr>
      <tbody>
        <tr>
          <td>{selectedStats.lastThreeMonths.month1}</td>
          <td>{selectedStats.lastThreeMonths.month2}</td>
          <td>{selectedStats.lastThreeMonths.month3}</td>
        </tr>
      </tbody>
    </table>
  </div>
)
 }

 toggleApplicationModal = () => {
   this.setState({applicationModalOpen: !this.state.applicationModalOpen})
 }

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

 createNewApplication = () => {
   var applicationPostData = {
     name: this.state.applicationInfo.name,
     description: this.state.applicationInfo.description,
     hasSupportContract: this.state.applicationInfo.hasSupportContract,
     customerId: this.state.customers[this.state.selectedId].id
   }
   CreateApplication(applicationPostData).then(response => {
     toast.success("Application Created")
     this.toggleApplicationModal()
   })


 }

 applicationDetailsRender = () => {
   var applicationDetails = this.state.applications[this.state.selectedApplicationId]
   return (
    <Card >
    <CardTitle>Application Details</CardTitle>
    <Form>
      <FormGroup>
        <Label sm={2} for="applicationName">Name</Label>
        <Input value={applicationDetails.name} id="applicationName"></Input>
        <Label sm={2} for="applicationDescription">Description</Label>
        <Input value={applicationDetails.description} id="applicationDescription"></Input>
      </FormGroup>
      <FormGroup check>
            <Label check>
              <Input type="checkbox" name="hasSupportContract" checked={applicationDetails.hasSupportContract} />{' '}
              Has Support Contract
            </Label>
      </FormGroup>
      <FormGroup>
        <div>Installation Date: {formatADateAndTime(applicationDetails.installationDate)}</div>
      </FormGroup>
    </Form>
    </Card>
   )
 }

 customerSideBar(){
   return(
     <ListGroup>
     <ListGroupItem>All</ListGroupItem>
{this.state.customers.map((customer, id) => {
  return(
    <ListGroupItem>{customer.name}</ListGroupItem>
  )
})}
</ListGroup>
   )
 }



render(){
    return(
    <div>
    <Row xs="2">Hello</Row>
    <Col xs="2">
     {this.customerSideBar()}
    </Col>
    {/* {this.customersTableRender()} */}
    {/* {this.state.applicationsVisable === true && (this.applicationsTableRender())}
    {this.state.applicationDetailsVisable === true && (this.applicationDetailsRender())}
    {this.state.callsVisable === true && (this.callsTableRender())}
    {this.state.statsVisable === true && (this.statsTableRender())} */}
    <Modal isOpen={this.state.applicationModalOpen} toggle={this.toggleApplicationModal}>
      <ModalHeader toggle={this.toggleApplicationModal}>New Application</ModalHeader>
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
        <Button color="primary" onClick={this.createNewApplication}>Save</Button>{' '}
        <Button color="secondary" onClick={this.toggleApplicationModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
 
    </div>
    )
}
  





}

export default Customers