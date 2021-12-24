
const { Gpio } = require( 'onoff' );
const rpio = require('rpio');
rpio.open(21, rpio.OUTPUT);

const sensor = require("node-dht-sensor").promises;
 
const ledOut = new Gpio( '4', 'out' );
const moistureOut = new Gpio( '21', 'out' );
function readInput() {
    return ledOut.readSync();
  }
  
  function write(value) {
    ledOut.writeSync(parseInt(value));
  }
  
async function readDhT(){
  try {
    const res = await sensor.read(11, 17);
    // console.log(
    //   `temp: ${res.temperature}°C, ` +
    //     `humidity: ${res.humidity}%`
    // );
    return {temperature:res.temperature,humidity:res.humidity};
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
}

function readMoisture() {
  console.log('Pin 21 is currently ' + (rpio.read(21) ? 'high' : 'low'));
  const data=moistureOut.readSync();
  console.log(data);
  return data;
}

  module.exports={readInput,write,readDhT,readMoisture}