import React,{useState} from 'react';
import {Table, Input, Card, CardTitle, CardBody} from 'reactstrap';
import PropTypes from 'prop-types';

function TableWidget({ tableData, colTitles, colNames, title}) {



// searchTableData(event){
//     if(event.target.value.length === 0)
//     {
//     this.setState({searchdata: this.state.tableData})
//     }
//     else
//     {
//     var searchdata = this.state.tableData.filter(record => record.value.contains(event.target.value) === true)
//     this.setState({searchdata: searchdata})
//     }
// }


    return(
        <Card style={{width: 800}}>
        <CardBody>
        <CardTitle style={{width: "100%", textAlign: 'center', fontSize: 27, }}>{title}</CardTitle>
        <Table hover>
        <thead>
            <tr>
                {colTitles.map((title, id) => {
                    return(
                        <th>{title}</th>
                    )
                })}
            </tr>
        </thead>
        <tbody>
          
                {tableData.map((record, id) => {
                    return(
                        <tr>
                        <td>{record[colNames[0]]}</td>
                        <td>{record[colNames[1]]}</td>
                        <td>{record[colNames[2]]}</td>
                        <td>{record[colNames[3]]}</td>
                        </tr>
                    )
                })}
            
        </tbody>
        </Table>
        </CardBody>
        </Card>
    )
}

export default TableWidget

TableWidget.propTypes = {
    tableData: PropTypes.array.isRequired,
    colTitles: PropTypes.array.isRequired,
    colNames: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired
}