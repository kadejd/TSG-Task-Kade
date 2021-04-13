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
    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
      GetAllCustomers().then(response => {
        if(response.status === "OK")
        {
          if(window.location.pathname.includes("/customerdetails"))
          {
            var customerId = parseInt(window.location.pathname.slice(17))
            var currentCustomer = {} 
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
      window.location.assign('/customerdetails/' + customer.id)
    }
    return(
        <div style={{fontSize: 20}}>
        <Navbar color="light" light expand="md">
        {/* <NavbarBrand href="/">Dashboard</NavbarBrand> */}
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink style={{color: window.location.pathname.includes("/dashboard") == true ? "black" : "grey"}} href="/">Dashboard</NavLink>
            </NavItem>
            <NavItem>
              <NavLink style={{color: window.location.pathname.includes("/calls") == true ? "black" : "grey"}} href="/calls">Calls</NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink href="/Applications">Applications</NavLink>
            </NavItem> */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle style={{color: window.location.pathname.includes("/customerdetails") == true ? "black" : "grey"}}  nav caret>
                {SelectedCustomer.name}
              </DropdownToggle>
              <DropdownMenu left>
                {customerList.map((customer, id) => {
                  return(
                    <DropdownItem onClick={() => customerSelect(customer)}>{customer.name}</DropdownItem>
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