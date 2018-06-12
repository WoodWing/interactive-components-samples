(function() {
    function InteractiveComponentSdk() {
        this._fitHeight = -1;
        this._channelId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
        this.log = false;
    }

    /**
     * Get id of communication channel used in logging.
     * @return {string}
     */
    InteractiveComponentSdk.prototype.channelId = function() {
        return this._channelId;
    };

    /**
     * Enable or disable logging communication message on console.
     * IntCompSdk.logMessages(true)  will enable logging
     * IntCompSdk.logMessages(false)  will disable logging
     * @param enable - a boolean indicating if logging needs to be enabled or disabled
     */
    InteractiveComponentSdk.prototype.logMessages = function(enable) {
        this.log = !!enable;
    };

    /**
     * Start listening to incoming messages from ContentStation. For every message the callback argument is called with the message.
     * This outer communication layer of the ContentStation message is stripped, because this is routing info and currently not used.
     * See documentation which messages can be sent by ContentStation.
     * @param callback {Function} to be called with the incoming messages (json data)
     * @return {Function} a function to stop listening to incoming messages.
     */
    InteractiveComponentSdk.prototype.listen = function(callback) {
        var channelId = this._channelId;
        var _onExtCompMessage = function(event) {
            var msg = event.data;
            if (msg && msg.channel === 'de.intComp') {
                IntCompSdk.log && console.log('IntCompSdk.#' + channelId + '.onMessage', JSON.stringify(msg.message));
                callback(msg.message);
            }
        };

        IntCompSdk.log && console.log('IntCompSdk.#' + this._channelId + '.listen');
        window.addEventListener('message', _onExtCompMessage, false);
        return function() {
            window.removeEventListener('message', _onExtCompMessage);
        };
    };

    /**
     * Send a message to ContentStation.
     * In this function an outer communication layer is added which is needed by ContentStation.
     * See documentation which message can be handled by ContentStation.
     * @param message - json data message.
     */
    InteractiveComponentSdk.prototype.postMessage = function(message) {
        this.log && console.log('IntCompSdk.#' + this._channelId + '.postMessage', JSON.stringify(message));
        parent.postMessage({
            channel: 'de.intComp',
            message: message
        }, '*');
    };

    /**
     * Call this to indicate the page is ready to accept data. It will sent a readyForData message to ContentStation,
     * which will respond with a useData message, containing the json data for the component or edit dialog.
     */
    InteractiveComponentSdk.prototype.readyForData = function() {
        this.postMessage({
            id: 'readyForData',
            data: this._channelId, // Add channel id, so ContentStation can identify this page in it's logging. (CS Dev only)
            version: '1.0'
        })
    };

    /**
     * Start listening to resizing of the interactive component edit or view page. Every time the height is changed,
     * the listener will sent a message to ContentStation, to adjust component height in the editor to fit.
     * This can also be used to fit the page in the edit dialog, but it is better to use fitHeight() in that case.
     * NOTE: It can happen that this wont detect changes in height due to the changes in the content made by these page scripts.
     * In this case simply do an extra call of IntCompSdk.fitHeight() after handling the incoming useData message.
     * See preview-example.html
     * @return {Function} function to stop listening to height changes.
     */
    InteractiveComponentSdk.prototype.autoHeight = function() {
        var _onExtCompResize = function() {
            setTimeout(function () {
                IntCompSdk.fitHeight();
            });
        };

        this.fitHeight();
        window.addEventListener('resize', _onExtCompResize);

        return function() {
            window.removeEventListener('resize', _onExtCompResize);
        };
    };

    /**
     * Send a message to ContentStation to adjust height to fit this page.
     * It will adjust the height of the container to fit this page. The container can be an interactive component in the editor
     * or the edit dialog.
     */
    InteractiveComponentSdk.prototype.fitHeight = function() {
        var rect = document.body.getBoundingClientRect();
        if (this._fitHeight !== rect.height && rect.height) {
            this._fitHeight = rect.height;
            this.postMessage({
                id: 'resize',
                data: {
                    height: rect.height + 'px'
                },
                version: '1.0'
            });
        }
    };

    /**
     * The public SDK entry to be used in page scripts.
     * @type {InteractiveComponentSdk}
     */
    window.IntCompSdk = new InteractiveComponentSdk();
})();