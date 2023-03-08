const mqtt = require('mqtt');
const readline = require('readline');
const dns = require('dns');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const brokerUrl = 'mqtt://test.mosquitto.org';
const brokerHostname = brokerUrl.substring(brokerUrl.indexOf('//') + 2);

dns.lookup(brokerHostname, function (err, address) {
  if (err || !address) {
    console.log('Não foi possível resolver o endereço do broker MQTT.');
    process.exit(1);
  } else {
    const client = mqtt.connect(brokerUrl);
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
  }
});
