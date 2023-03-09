const mqtt = require('mqtt');
const readline = require('readline');
const dns = require('dns');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const brokerUrl = 'mqtt://test.mosquitto.org';
const brokerHostname = brokerUrl.substring(brokerUrl.indexOf('//') + 2);

const options = {
  'reiniciar': 'reiniciar',
  'notepad': 'notepad',
  'calc': 'calc',
  'browser': 'browser',
  'print': 'print',
  'sair': 'sair'
};

dns.lookup(brokerHostname, function (err, address) {
  if (err || !address) {
    console.log('Não foi possível resolver o endereço do broker MQTT.');
    process.exit(1);
  } else {
    const client = mqtt.connect(brokerUrl);
    client.on('connect', function () {
      console.log('Conectado ao broker MQTT');
      rl.on('line', function (input) {
        if (options[input]) {
          if (input === 'sair') {
            console.log('Saindo do programa...');
            process.exit(0);
          }
          console.log(`Enviando comando para abrir o aplicativo ${input}`);
          client.publish('suporte', options[input]);
        } else {
          console.log(`Opção inválida: ${input}`);
        }
      });
    });
  }
});