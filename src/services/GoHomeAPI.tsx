export async function GetApiUrlFromService(serviceUrl: string){
    const response = await fetch(serviceUrl);
    if(response.ok){
        return response.text();
    }else{
        throw new Error('Could not fetch the API domain');
    }
}

export async function testApiUrl(apiUrl: string) {
    const response = await fetch(apiUrl);
    return new Promise(() => {
        return response.ok;
    });
}
