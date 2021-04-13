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
import { Link} from 'react-router-dom'


export function TopNavBar(){
    const [isOpen, setIsOpen] = useState(false);
    const [customerList, setCustomerList] = useState([])
    const [SelectedCustomer, setSelectedCustomer] = useState({id: 0, name: "Customers"})
    const [navSelected, setNavSelected] =  useState(0);
    const toggle = () => setIsOpen(!isOpen);

    //Gets all customers to produce a customer list for drop down and sets customer name as title if valid id is passed. 
    useEffect(() => {
      GetAllCustomers().then(response => {
        if(response.status === "OK")
        {
          if(window.location.pathname.includes("/customerdetails"))
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

      switch(window.location.pathname)
      {
        case "/dashboard" : setNavSelected(1);
        break;
        case "/calls" : setNavSelected(2);
        break;
        default: setNavSelected(3)
      }
    }, [])

    function customerSelect(customer){
      var currentCustomer = {...SelectedCustomer};
      currentCustomer.id = customer.id;
      currentCustomer.name = customer.name
      setSelectedCustomer(currentCustomer);
      window.location.reload()
    }
    return(
        <div style={{fontSize: 20}}>
          <Navbar color="light" light expand="md">
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem >
                  <NavLink onClick={() => { window.location.reload() }}><Link style={{color: navSelected == 1 ? "black" : "grey"}} to="/dashboard">Dashboard</Link></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => {window.location.reload()}}><Link style={{color: navSelected == 2 ? "black" : "grey"}} to="/calls">Calls</Link></NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle style={{color: navSelected == 3 ? "black" : "grey"}}  nav caret>
                    {SelectedCustomer.name}
                  </DropdownToggle>
                  <DropdownMenu left={true}>
                    {customerList.map((customer, id) => {
                      return(
                        <DropdownItem key={id} onClick={() => {customerSelect(customer);}}><Link to={`/customerdetails/${customer.id}`}>{customer.name} </Link></DropdownItem>
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