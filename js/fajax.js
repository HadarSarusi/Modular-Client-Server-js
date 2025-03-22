class FXMLHttpRequest {
    constructor() {
        this.method = '';
        this.url = '';
        this.async = true;
        this.responseText = '';
        this.status = 0;
        this.success = false;
        this.onload = null;
    }

    open(method, url, async = true) {
        this.method = method;
        this.url = url;
        this.async = async;
    }

    send(data = null) {
        Network.sendRequest(this.method, this.url, data, (response) => {
            this.responseText = JSON.stringify(response);
            this.status = response.status ?? 0;
            this.success = response.success === true;
    
            if (this.onload) this.onload(); 
        });
    }
    
}
