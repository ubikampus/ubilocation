/**
 * See examples on web bluetooth usage here:
 * https://googlechrome.github.io/samples/web-bluetooth/
 */

// The service and characteristic codes are set accordingly in the GATT server.
const SERVICE = parseInt('0x180D', 16);
const CHARACTERISTIC = parseInt('0x2A39', 16);

const fetchDeviceName = async (): Promise<string> => {
  if (!navigator.bluetooth) {
    throw new Error('web bluetooth not supported on this device');
  }

  const device = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [SERVICE],
  });

  if (device.gatt) {
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE);
    const characteristic = await service.getCharacteristic(CHARACTERISTIC);
    const descriptor = await characteristic.getDescriptor(
      'gatt.characteristic_user_description'
    );
    const deviceName = await descriptor.readValue();

    const decoder = new TextDecoder('utf-8');
    return decoder.decode(deviceName);
  } else {
    throw new Error('no GATT server in the bluetooth device');
  }
};

const fetchName = async (): Promise<string | null> => {
  try {
    console.log('fetching bluetooth name...');
    return await fetchDeviceName();
  } catch (e) {
    // This is needed because some web bluetooth exceptions are unconventional
    const err = e.stack ? e : e.message;

    console.log('could not fetch bt name:', err);
    return null;
  }
};

export default fetchName;
