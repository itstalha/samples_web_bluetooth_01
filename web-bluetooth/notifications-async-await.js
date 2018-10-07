var myCharacteristic;

async function onStartButtonClick() {
  dataFromSensor.push(Math.random());
  log('Commits: '+ 9);
  let serviceUuid = document.querySelector('#service').value;
  log('0. serviceUuid > '+serviceUuid);
  if (serviceUuid.startsWith('0x')) {
    serviceUuid = parseInt(serviceUuid);
    log('1. serviceUuid > '+serviceUuid);
  }

  //Talha - Logging Service UUID
  serviceUuid = '0000ffe0-0000-1000-8000-00805f9b34fb';
  log('2. serviceUuid > '+serviceUuid);

  let characteristicUuid = document.querySelector('#characteristic').value;
  log('0. characteristicUuid > '+characteristicUuid);
  if (characteristicUuid.startsWith('0x')) {
    characteristicUuid = parseInt(characteristicUuid);
    log('1. characteristicUuid > '+characteristicUuid);
  }
  //Talha - Logging characteristicUuid 
  characteristicUuid = '0000ffe1-0000-1000-8000-00805f9b34fb';
  log('2. characteristicUuid > '+characteristicUuid);

  try {
    log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
        filters: [{services: [serviceUuid]}]});

    log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    log('Getting Service...');
    const service = await server.getPrimaryService(serviceUuid);

    log('Getting Characteristic...');
    myCharacteristic = await service.getCharacteristic(characteristicUuid);

    await myCharacteristic.startNotifications();

    log('> Notifications started');
    myCharacteristic.addEventListener('characteristicvaluechanged',
        handleNotifications);
  } catch(error) {
    log('Argh! ' + error);
  }
}

async function onStopButtonClick() {
  if (myCharacteristic) {
    try {
      await myCharacteristic.stopNotifications();
      log('> Notifications stopped');
      myCharacteristic.removeEventListener('characteristicvaluechanged',
          handleNotifications);
    } catch(error) {
      log('Argh! ' + error);
    }
  }
}

function handleNotifications(event) {
  let value = event.target.value;
  let a = [];
  let b = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
    b.push(('00' + value.getUint8(i).toString(10)).slice(-2));
    dataFromSensor.push(('00' + value.getUint8(i).toString(10)).slice(-2));
     
  }
 // log('>' + a.join(' '));
  log('>' + b.join(' '));
}
