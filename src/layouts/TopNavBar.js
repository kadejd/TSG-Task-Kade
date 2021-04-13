import React, {useState, useEffect} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
  } from 'reactstrap';
import {GetAllCustomers} from '../utilities/axiosUtility'


export function TopNavBar(){
    const [isOpen, setIsOpen] = useState(false);
    const [customerList, setCustomerList] = useState([])
    const [SelectedCustomer, setSelectedCustomer] = useState({id: 0, name: "Customers"})

    const toggle = () => setIsOpen(!isOpen);

    //Gets all customers to produce a customer list for drop down and sets customer name as title if valid id is passed. 
    useEffect(() => {
      GetAllCustomers().then(response => {
        if(response.status === "OK")
        {
          if(window.location.pathname.includes("/TSG-Task-Kade/customerdetails"))
          {
            var customerId = parseInt(window.location.pathname.slice(17))
            var currentCustomer = {id: 0, name: "Customers"} 
            response.data.map((customer, id) => {
              if(customer.id === customerId)
              {
                currentCustomer = customer
                
              }
            })
            setCustomerList(response.data)
            setSelectedCustomer(currentCustomer);
          }
          else
          {
           var currentCustomer = {
                id: 0,
                name: "Customers"
           }
          setCustomerList(response.data)
          setSelectedCustomer(currentCustomer)
          }
        }
      })
    }, [])

    function customerSelect(customer){
      var currentCustomer = {...SelectedCustomer};
      currentCustomer.id = customer.id;
      currentCustomer.name = customer.name
      setSelectedCustomer(currentCustomer);
      window.location.assign('/TSG-Task-Kade/customerdetails/' + customer.id)
    }
    return(
        <div style={{fontSize: 20}}>
          <Navbar color="light" light expand="md">
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink style={{color: window.location.pathname.includes("/dashboard") == true ? "black" : "grey"}} href="/TSG-Task-Kade/Dashboard">Dashboard</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{color: window.location.pathname.includes("/calls") == true ? "black" : "grey"}} href="/TSG-Task-Kade/calls">Calls</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle style={{color: window.location.pathname.includes("/customerdetails") == true ? "black" : "grey"}}  nav caret>
                    {SelectedCustomer.name}
                  </DropdownToggle>
                  <DropdownMenu left={true}>
                    {customerList.map((customer, id) => {
                      return(
                        <DropdownItem key={id} onClick={() => customerSelect(customer)}>{customer.name}</DropdownItem>
                      )
                    })}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
              <NavbarText></NavbarText>
            </Collapse>
          </Navbar>
        </div>

    )




}