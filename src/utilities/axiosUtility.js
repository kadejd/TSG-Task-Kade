import axios from 'axios';

    //Get
export const GetAsync = async (url) => {
    try{
        var response = await axios.get(url)
        const result = Object.keys(response).map((key) => response[key]);
        return{
            status: result[2],
            data: result[0]
        }
        
    }catch(e){
        return e;
    }
}

    //Post
export const PostAsync = async (url, postdata) => {
    try{
        var response = await axios.post(url, postdata )
        const result = Object.keys(response).map((key) => response[key]);
        return{
            status: result[2],
            data: result[0]
        }
    }catch(e){
        // alert("error" + e);
        return e;
    }
}

    //Patch
export const PatchAsync = async (url, postdata) => {
    try{
        var response = await axios.patch(url, postdata )
        const result = Object.keys(response).map((key) => response[key]);
        return{
            status: result[2],
            data: result[0]
        }
    }catch(e){
        return e;
    }
}

    //Put
export const PutAsync = async (url, postdata) => {
    try{
        var response = await axios.put(url, postdata )
        const result = Object.keys(response).map((key) => response[key]);
        return{
            status: result[2],
            data: result[0]
        }
    }catch(e){
        return e;
    }
}

//want to set network middleware to attach tsgLink as axios default header
const tsgLink = "https://techtestcalllogapi.azurewebsites.net/api/";

//Administration
export const GetAdminstration = async() => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Adminstration')
    return response
}

export const CreateAdminstration = async(postData) => {
    //For Ref
    var refPostdata = {
        name: "",
        reason: "",
        description: ""
    }

    var response = await PostAsync('https://techtestcalllogapi.azurewebsites.net/api/Adminstration', postData)
    return response
}
 

//Application
export const GetApplicationById = async(id) => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Application/' + id)
    return response
}

export const GetAllApplicationRecords = async() => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Application')
    return response
}

export const CreateApplication = async(postData) => {
    //For Reference
    var refPostData = {
        name: "Test",
        description: "Test",
        hasSupportContract: false,
        customerId: 0
    }

    var response = await PostAsync('https://techtestcalllogapi.azurewebsites.net/api/Application', postData)
    return response
}

export const UpdateApplication = async(putData) => {
        //For Reference
        var refPutData = {
            applicationId: 0,
            name: "",
            description: "",
            hasSupportContract: false,
        }


    var response = await PutAsync('https://techtestcalllogapi.azurewebsites.net/api/Application', putData)
    return response
}

export const GetApplicationsByCustomerId = async(id) => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Application/customer/' + id)
    return response
}

//Call

export const GetAllCallLogs = async() => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Call')
    return response
}

export const UpdateCallLog = async(patchData) => {
    //For Reference
    var refPatchData = {
        callId: 0,
        status: 0
    }


    var response = await PatchAsync('https://techtestcalllogapi.azurewebsites.net/api/Call', patchData)
    return response
}

export const GetCallLogById = async(id) => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Call/' + id)
    return response
}

export const GetCallLogsByCustomerId = async(id) => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Call/customer/' + id)
    return response
}

//Customer

export const GetAllCustomers = async() => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Customer')
    return response
}

export const GetCustomerById = async(id) => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Customer/' + id)
    return response
}

//Statistics

export const GetStatisticsByCustomerId = async(id) => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Statistics/' + id)
    return response
}

//Status

export const GetAllStatus = async() => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Status')
    return response
}

export const GetStatusById = async(id) => {
    var response = await GetAsync('https://techtestcalllogapi.azurewebsites.net/api/Status/' + id)
    return response
}