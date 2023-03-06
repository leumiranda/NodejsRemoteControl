const mqtt = require('mqtt');
const readline = require('readline');
const client = mqtt.connect('mqtt://test.mosquitto.org');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.on('connect', function () {
  console.log('Conectado ao broker MQTT');

  rl.on('line', function (input) {
    if (input === 'reiniciar') {
      client.publish('suporte', 'reiniciar');
    }
    if (input === 'notepad') {
      client.publish('suporte', 'notepad');
    }
    if (input === 'calc') {
      client.publish('suporte', 'calc');
    }
    if (input === 'browser') {
      client.publish('suporte', 'browser');
    }
  });
});
