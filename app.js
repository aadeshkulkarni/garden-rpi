
const fs = require('fs');
var mqtt = require('mqtt')
const {readDhT,write}=require('./rpi')

var options = {
    host: '1c3d4296c61d4979b7b2d99c869937f3.s2.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'aadesh.kulkarni',
    password: 'K@izen080394'
}

//initialize the MQTT client
var client = mqtt.connect(options);

//setup the callbacks
client.on('connect', function () {
    console.log('Connection from RPi to MQTT successful');
});

client.on('error', function (error) {
    console.log('RPi MQTT Error:',error);
});

client.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
    if(topic==='status/water/set'){
      let rawdata = fs.readFileSync('config.json');
      let configData= JSON.parse(rawdata);
      
      let data = JSON.stringify({...configData,status:message.toString()});
      fs.writeFileSync('config.json', data);

      write(message.toString());
    }
    if(topic==='status/timer/set'){
      let rawdata = fs.readFileSync('config.json');
      let configData= JSON.parse(rawdata);
      
      let data = JSON.stringify({...configData,"timer":JSON.parse(message.toString())});
      fs.writeFileSync('config.json', data);

      // write(message.toString());
    }
    
});

// subscribe to topic 'my/test/topic'
// client.subscribe('my/test/topic');
client.subscribe('get/status/all');
client.subscribe('status/water/set');
client.subscribe('status/timer/set');

setInterval(async()=>{
  let status=await readDhT();

  let rawdata = fs.readFileSync('config.json');
  let configData= JSON.parse(rawdata);
  
  let response=JSON.stringify({...status,water:configData.status});
  client.publish('get/status/all',response);
},5000)

// publish message 'Hello' to topic 'my/test/topic'
// client.publish('my/test/topic', 'Hello');