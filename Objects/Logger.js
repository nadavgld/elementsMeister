class Logger {
    constructor(doc, ui) {
        this.document = doc;
        this.UI = ui;
    }

    setDocument(document) { this.document = document; }

    setUI(ui) { this.UI = ui; }

    log(msg) {
        var _newDiv = this.document.createElement("div");

        _newDiv.className = 'log-msg';
        _newDiv.innerHTML = msg;

        this.UI.prepend(_newDiv)
    }

    logMultiple(msgs) {
        const self = this;
        msgs.forEach(msg => self.log(msg))
    }
}

export default new Logger();