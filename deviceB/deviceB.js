const mqtt = require('mqtt');
const { exec } = require('child_process');
const client = mqtt.connect('mqtt://test.mosquitto.org');

client.on('connect', function () {
  console.log('Conectado ao broker MQTT');

  client.subscribe('suporte', function (err) {
    if (!err) {
      console.log('Inscrito no tópico suporte');
    }
  });
});

client.on('message', function (topic, message) {
  if (topic === 'suporte' && message.toString() === 'reiniciar') {
    console.log('Reiniciando o sistema...');
    exec('shutdown /r', (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Erro: ${stderr}`);
        return;
      }
      console.log(`Saída: ${stdout}`);
    });
  }
  if (topic === 'suporte' && message.toString() === 'notepad') {
    // Verifica o sistema operacional para determinar o comando a ser utilizado
    const isWindows = process.platform === 'win32';
    const command = isWindows ? 'notepad' : 'gedit'; // Windows ou Linux

    // Executa o comando
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao tentar abrir o Bloco de Notas: ${error.message}`);
        return;
      }
      console.log(`Saída padrão: ${stdout}`);
      console.error(`Saída de erro: ${stderr}`);
    });
  }
  if (topic === 'suporte' && message.toString() === 'calc') {
    const isWindows = process.platform === 'win32';
    const command = isWindows ? 'calc' : 'gnome-calculator';

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao tentar abrir a calculadora: ${error.message}`);
        return;
      }
      console.log(`Saída padrão: ${stdout}`);
      console.error(`Saída de erro: ${stderr}`);
    });
  }
  if (topic === 'suporte' && message.toString() === 'browser') {
    if (process.platform === 'win32') {
      exec('start "" "http://www.example.com"');
    } else if (process.platform === 'darwin') {
      exec('open "http://www.example.com"');
    } else {
      exec('xdg-open "http://www.example.com"');
    }
  }
});
