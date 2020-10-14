//script calls ping to increment ping counter every 3 months (or any other interval); So, Script keeps track of time.
//script reads gets interval from the contract and pings on that basis

const axios = require("axios");
const WebSocket = require("ws");

const config = {
  //url of the api gateway we are using to deploy to Ethereum
  apiPrefix: "https://beta-api.ethvigil.com/v0.1/contract/",
  //our secret key that acts like a license key to use the api gateway service
  apiKey: "f99ff89f-3430-4c10-8686-648c1ff102a2",
  //address of the uWill contract
  uWillContractAddress: "",
  //websocket sercure url: This is so we can open a connection to EV from our listener
  wsUrl: "wss://beta.ethvigil.com/ws",
};

//check if config fields are present and valid; thrown error otherwise
//is api key, demo contract and audit contract present
if (!config.apiKey || !config.uWillContractAddress) {
  console.error("Check config object for empty fields");
  process.exit(0);
}

//to store websocket session id
var wsSessionID;
// bool for got event or not
var receivedPingEvent;
var receivedExecutionEvent;

const uWillInstance = axios.create({
  baseURL: config.apiPrefix + config.uWillInstance,
  timeout: 5000,
  headers: { "X-API-KEY": config.apiKey },
});

//instantiating a WebSocket channel; passing it the url of the EV WebSocket
//EV will expect WS connections at the url
const ws = new WebSocket(config.wsUrl);

//.on signigies an event handler, a custom event in this case
//upon open event i.e. websocket connection opening, run open() function
ws.on("open", function open() {
  //send, as string, this JSON object
  //we issue register command to EV along with our api key, now EV
  //knows that
  ws.send(
    JSON.stringify({
      command: "register",
      key: config.apiKey,
    })
  );
});

ws.on("message", function incoming(data) {
  //receiving data from EV as JSON string, converting to JSON
  data = JSON.parse(data);
  console.log("Received data from EV via WebSocket connection");
  //i.e. if register command is not acknowledged
  if (data.command == "register:nack") {
    console.error("Bad apiKey sent to EV gateway");
  }
  if (data.command == "register:ack") {
    wsSessionID = data.sessionID;
    console.log("authenticated with WebSocket");
    console.log("writing to uWill contract...");
    //run the ping function every 3 months
    uWillInstance
      .post("/ping")
      .then((response) => {
        console.log("response after post call to ping: ", response.data);
        if (!response.data.success) {
          console.log("post call not successful...");
          process.exit(0);
        }
      })
      .catch((err) => {
        if (err.response.data) {
          console.log(err.response.data);
          if (err.response.data.error == "unknown contract") {
            console.error("Wrong contract address in config object!");
          }
        } else {
          console.log(error.response);
        }
        process.exit(0);
      });
  }

  if (data.type == "event" && data.event_name == "Ping") {
    receivedPingEvent = true;
    console.log("Ping successful. Ping count is:", data.pingCount);
    if (pingCount > 3) {
      uWillInstance
        .post("./unlockFunds")
        .then((response) => {
          if (!response.data.success) {
            console.log("post call to unlockFunds unsuccessful...");
            process.exit(0);
          }
        })
        .catch((err) => {
          if (err.response.data) {
            console.log(err.response.data);
            if (err.response.data.error == "unknown contract") {
              console.error("Wrong contract address in config object!");
            }
          } else {
            console.log(error.response);
          }
          process.exit(0);
        });
      if (data.type == "event" && data.event_name == "WillExecuted") {
        receivedExecutionEvent = true;
        console.log(
          "Will executed. Funds unlocked and ready for withdrawal by heirs."
        );
      }
    }
  }
});
