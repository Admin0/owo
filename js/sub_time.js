class Time {
    start = localStorage.timer || Date.now();

    log(msg) { 
        this[msg] = Date.now() - this.start; 
        console.log(`${this[msg]} ms: ${msg}`);
    };
};