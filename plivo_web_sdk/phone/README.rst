Web Phone Demo
==============
This is a very simple demo showing how you can make phone calls from the web browser to both sip addresses and PSTN phone numbers

Getting Started
==============

Please refer to our [Getting Started](https://www.plivo.com/docs/getting-started/web-sdk/quick-start/) doc on how to create Plivo Endpoints and start making calls using the Web SDK.


Where it all begins
-------------------
In the document's ready function is where the Plivo JS Objects is initialised
::
    $(document).ready(function() {
            Plivo.onWebrtcNotSupported = webrtcNotSupportedAlert;
            Plivo.onReady = onReady;
            Plivo.onLogin = onLogin;
            Plivo.onLoginFailed = onLoginFailed;
            Plivo.onLogout = onLogout;
            Plivo.onCalling = onCalling;
            Plivo.onCallRemoteRinging = onCallRemoteRinging;
            Plivo.onCallAnswered = onCallAnswered;
            Plivo.onCallTerminated = onCallTerminated;
            Plivo.onCallFailed = onCallFailed;
            Plivo.onMediaPermission = onMediaPermission;
            Plivo.onIncomingCall = onIncomingCall;
            Plivo.onIncomingCallCancelled = onIncomingCallCancelled;
            
            Plivo.init();

        });

Registering
-----------
The UI starts off with a basic login screen for accepting your Plivo Endpoint Credentials. To use the entered values to log in, use the following code
::
    function login() {
            Plivo.conn.login($("#username").val(), $("#password").val());
    }

The onLogin listener function, which was registered at the start is then invoked when Plivo sends back the onLogin event
::
    function onLogin() {
            $('#status_txt').text('Logged in');
            $('#login_box').hide();
            $('#logout_box').show();
            $('#callcontainer').show();
    }

Making a call
-------------
Enter the number or sip uri in the post login UI and click the call button. This action causes the following code to run
::
    if ($('#make_call').text() == "Call") {
            var dest = $("#to").val();
            if (isNotEmpty(dest)) {
              $('#status_txt').text('Calling..');
              Plivo.conn.call(dest);
              $('#make_call').text('End');
            }
            else{
              $('#status_txt').text('Invalid Destination');
    }    
The code after discarding validations and UI state changes boils down to one line.
::
            Plivo.conn.call(dest);

Handling Incoming calls
-----------------------
By creating the onIncomingCall listener, the Plivo JS object can handle calls coming into the Plivo Endpoint. 
::
    function onIncomingCall(account_name, extraHeaders) {
            console.log("onIncomingCall:"+account_name);
            console.log("extraHeaders=");
            for (var key in extraHeaders) {
                console.log("key="+key+".val="+extraHeaders[key]);
            }
            IncomingCallUI();
      }

The UI which shows an incoming call is rendered with the above code. The two actions that can be performed now are answer or reject. The code for answering looks like this.
::
    function answer() {
            console.log("answering")
            $('#status_txt').text('Answering....');
            Plivo.conn.answer();
            callAnsweredUI()
    }

The reject code looks like this
::
    function reject() {
            callUI()
            Plivo.conn.reject();
    }

Terminating a call
------------------
This code may be used to terminate a call. 
::
    else if($('#make_call').text() == "End") {
            $('#status_txt').text('Ending..');
            Plivo.conn.hangup();
            $('#make_call').text('Call');
            $('#status_txt').text('Ready');
    }
