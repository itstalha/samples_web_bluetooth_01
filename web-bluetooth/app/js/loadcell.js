var myCharacteristic;
var repCount = 0;
var setCount = 0;
var setCount = 0;
var repThreshold = 2;
var secThreshold = 1;
var repsPerSet = 3;
var nowDate ;
var nowSec ;  
var startSec;
var repStart = false;
var repCounted = false;

async function onStartButtonClick(){
  //dataFromSensor.push(Math.random());
  ////log('Commits: '+ 18);


  //Talha - Logging Service UUID
 let  serviceUuid = '0000ffe0-0000-1000-8000-00805f9b34fb';
////  log('2. serviceUuid > '+serviceUuid);

  //Talha - Logging characteristicUuid 
  let   characteristicUuid = '0000ffe1-0000-1000-8000-00805f9b34fb';
////  log('2. characteristicUuid > '+characteristicUuid);

  try {
   //// log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
        filters: [{services: [serviceUuid]}]});

  ////  log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

 ////   log('Getting Service...');
    const service = await server.getPrimaryService(serviceUuid);

   //// log('Getting Characteristic...');
    myCharacteristic = await service.getCharacteristic(characteristicUuid);

    await myCharacteristic.startNotifications();

   //// log('> Notifications started');
    myCharacteristic.addEventListener('characteristicvaluechanged',
        handleNotifications);
  } catch(error) {
   //// log('Argh! ' + error);
  }
}

async function onStopButtonClick() {
  if (myCharacteristic) {
    try {
      await myCharacteristic.stopNotifications();
     //// log('> Notifications stopped');
      myCharacteristic.removeEventListener('characteristicvaluechanged',
          handleNotifications);
    } catch(error) {
    ////  log('Argh! ' + error);
    }
  }
}

function handleNotifications(event) {
  let value = event.target.value;
  //let a = [];
  //let b = [];
  let c = [];
  let d = [];
  

  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
 // log('value>' + value);
 // log('value.toString()>' + value.toString());
 let temp = '';
 let floatNumber = '';

  for (let i = 0; i < value.byteLength; i++) {

    
    temp =String.fromCharCode(value.getUint8(i));
    c.push(temp);
    if ((temp != 's') && (temp != 'e'))
    {
      floatNumber = floatNumber + temp;
      d.push(temp);
      
    }
    
     
  }
  //log('a>' + a.join(' '));
  //log('b>' + b.join(' '));


  floatNumber = floatNumber.replace(/\s+/g, '');

  
  ////log('c> ' + c.join(' '));
 //// log('d> ' + d.join(' '));
  ////log('floatnumber> ' + floatNumber );
  if (floatNumber < 0)
  {
    floatNumber = 0;
  }
  dataFromSensor.push(floatNumber);
  document.getElementById("liveForce").innerHTML = floatNumber;

  nowDate = new Date();
  nowSec = nowDate.getSeconds();  

  if ( (floatNumber > repThreshold ) && (repCounted == false))
  {
    
    if(repStart == false)
    {
      startSec = nowSec;
      repStart = true;

    }
    
    else
    {
      
      if((nowSec - startSec) > secThreshold)

      {
        repCount++;

        setComplete = Math.floor(repCount / repsPerSet);
        
        if(setComplete > 0)
        {
          setCount++;
          document.getElementById("liveSet").innerHTML = setCount;
          repCount=0;
        }


        document.getElementById("liveRep").innerHTML = repCount;
        repStart = false;
        repCounted = true;
      }
    }

  }
  
  else if (floatNumber < repThreshold )

  {
    repCounted = false;

  }



}
