const GetApiUrlFromService = async (serviceUrl: string) => {
    const response = await fetch(serviceUrl);
    if(response.ok){
        return response.text();
    }else{
        throw new Error('Could not fetch the API domain');
    }
}

const TestApiUrl = async (apiUrl: string) => {
    const response = await fetch(apiUrl);
    return new Promise(() => {
        return response.ok;
    });
}

const ClickGarageDoorButton = async (apiEndpoint: string, pinCode: string) => {
    const postBody = JSON.stringify({ "pinCode" :pinCode })

    let response = await fetch(apiEndpoint + '/clickGarageDoorButton', {
        method: 'POST',
        body: postBody
    });

    return new Promise(() => {
        return response.ok;
    });
}

const GetGarageStatus = async (apiEndpoint: string) => {
    let response = await fetch(apiEndpoint + '/doorStatus');

    if(!response.ok){
        throw new Error('There was an error fetching the garage status');
    }

    return response.json();
}

const IsPinValid = async (apiEndpoint: string, apiPin: string) => {
    const postBody = JSON.stringify({ 'pinCode': apiPin })

    let response = await fetch(apiEndpoint + '/pinValid', {
        method: 'POST',
        body: postBody
    });

    return response.ok;
}
export { IsPinValid,
    GetGarageStatus,
    ClickGarageDoorButton, 
    TestApiUrl,
    GetApiUrlFromService };