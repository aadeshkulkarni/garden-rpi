var mqtt = require('mqtt')
const {readInput,write,readDhT,readMoisture}=require('./rpi');
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
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
    if(topic==='waterpump/set-status'){
        
        write(message)
    }
    if(topic==='dht-sensor/get-status'){
        
        readDhT()
    }
    if(topic==='soil-sensor/get-status'){
        
        readMoisture()
    }

    });

// subscribe to topic 'my/test/topic'
client.subscribe('dht-sensor/get-status');

// publish message 'Hello' to topic 'my/test/topic'
setInterval(async()=>{
    const res=await readDhT();
    client.publish('dht-sensor/get-status', res);
},3000)





/* Functions to perform actions */