const mqtt = require('mqtt');
const { exec } = require('child_process');

const brokerUrl = 'mqtt://test.mosquitto.org';
const supportTopic = 'suporte';

const client = mqtt.connect(brokerUrl);

client.on('connect', function () {
  console.log('Conectado ao broker MQTT');

  client.subscribe(supportTopic, function (err) {
    if (err) {
      console.error('Erro ao se inscrever no tópico', supportTopic, err);
      return;
    }
    console.log('Inscrito no tópico', supportTopic);
  });
});

client.on('message', function (topic, message) {
  if (topic !== supportTopic) {
    console.warn('Mensagem recebida em um tópico desconhecido', topic, message.toString());
    return;
  }

  const command = message.toString();
  switch (command) {
    case 'reiniciar':
      executeCommand('shutdown /r', 'Reiniciando o sistema...');
      break;
    case 'notepad':
      executeCommand(process.platform === 'win32' ? 'notepad' : 'gedit', 'Abrindo o bloco de notas...');
      break;
    case 'calc':
      executeCommand(process.platform === 'win32' ? 'calc' : 'gnome-calculator', 'Abrindo a calculadora...');
      break;
    case 'browser':
      openBrowser('http://www.example.com');
      break;
    default:
      console.warn('Comando desconhecido', command);
  }
});

function executeCommand(command, message) {
  console.log(message);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o comando: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erro ao executar o comando: ${stderr}`);
      return;
    }
    console.log(`Comando executado com sucesso: ${stdout}`);
  });
}

function openBrowser(url) {
  switch (process.platform) {
    case 'win32':
      exec(`start "" "${url}"`);
      console.log('Abrindo a URL...')
      break;
    case 'darwin':
      exec(`open "${url}"`);
      break;
    default:
      exec(`xdg-open "${url}"`);
  }
}
