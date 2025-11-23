
import { CarMetrics, DTC, Severity } from '../types';

let dataStreamInterval: number | null = null;
let currentMetrics: CarMetrics = {
    speed: 0,
    rpm: 0,
    coolantTemp: 40,
    fuelLevel: 75,
    voltage: 12.5,
};

const simulateDataChange = () => {
    // Simulate RPM and Speed changing with some noise
    const rpmChange = (Math.random() - 0.5) * 500;
    currentMetrics.rpm = Math.max(0, Math.min(8000, currentMetrics.rpm + rpmChange));
    currentMetrics.speed = Math.max(0, Math.min(220, (currentMetrics.rpm / 40) + (Math.random() * 5 - 2.5)));

    // Simulate other metrics changing slowly
    currentMetrics.coolantTemp += (Math.random() - 0.5) * 2;
    currentMetrics.coolantTemp = Math.max(20, Math.min(110, currentMetrics.coolantTemp));
    
    if (currentMetrics.speed > 1) {
       currentMetrics.fuelLevel -= 0.01;
       currentMetrics.fuelLevel = Math.max(0, currentMetrics.fuelLevel);
    }
    
    currentMetrics.voltage = 12.5 + Math.sin(Date.now() / 1000) * 0.5;

    // Ensure values are rounded for display
    return {
        speed: Math.round(currentMetrics.speed),
        rpm: Math.round(currentMetrics.rpm),
        coolantTemp: Math.round(currentMetrics.coolantTemp),
        fuelLevel: Math.round(currentMetrics.fuelLevel * 10) / 10,
        voltage: Math.round(currentMetrics.voltage * 10) / 10,
    };
};

// This is where you would place your real OBD2 communication logic.
// For now, we simulate the connection and data flow.
export const mockObd2Service = {
  connect: (): Promise<string> => {
    console.log("Simulating connection to OBD2 WiFi device...");
    return new Promise(resolve => {
      setTimeout(() => {
        const fakeVin = `WDD${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.floor(100000 + Math.random() * 900000)}`;
        console.log(`Connection successful. VIN read: ${fakeVin}`);
        resolve(fakeVin);
      }, 2500); // Simulate connection delay
    });
  },

  startDataStream: (onDataReceived: (data: CarMetrics) => void) => {
    if (dataStreamInterval) {
      window.clearInterval(dataStreamInterval);
    }
    console.log("Starting simulated data stream...");
    dataStreamInterval = window.setInterval(() => {
      const newMetrics = simulateDataChange();
      onDataReceived(newMetrics);
    }, 500); // Update data every 500ms
  },

  stopDataStream: () => {
    if (dataStreamInterval) {
      console.log("Stopping data stream.");
      window.clearInterval(dataStreamInterval);
      dataStreamInterval = null;
    }
  },

  scanForErrors: (): Promise<DTC[]> => {
    console.log("Simulating ECU error scan...");
    return new Promise(resolve => {
      setTimeout(() => {
        // In a real app, you would get these from the OBD2 reader.
        const potentialErrors = [
          { code: 'P0300', description: 'Fallo de encendido aleatorio/múltiple detectado', severity: 'critical' },
          { code: 'P0171', description: 'Sistema demasiado pobre (Banco 1)', severity: 'medium' },
          { code: 'U0121', description: 'Pérdida de comunicación con el módulo de control del ABS', severity: 'high' },
          { code: 'P0420', description: 'Eficiencia del sistema catalítico por debajo del umbral (Banco 1)', severity: 'low' },
          { code: 'B0074', description: 'Circuito del sensor de tensión del cinturón de seguridad del pasajero', severity: 'high' },
          { code: 'P0217', description: 'Condición de sobrecalentamiento del motor', severity: 'critical' }
        ];
        
        // Return a random subset of errors to simulate different scan results
        const errors = potentialErrors
            .filter(() => Math.random() > 0.4)
            .map(e => ({
                id: `${e.code}-${Date.now()}`,
                code: e.code,
                description: e.description,
                severity: e.severity as Severity,
                timestamp: new Date(),
            }));
            
        console.log(`Scan complete. Found ${errors.length} errors.`);
        resolve(errors);
      }, 3000); // Simulate scan delay
    });
  },
  
  clearError: (errorCode: string): Promise<boolean> => {
      console.log(`Simulating clearing error code: ${errorCode}`);
      return new Promise(resolve => {
          setTimeout(() => {
              console.log("Error code cleared from ECU (temporarily).");
              resolve(true);
          }, 1000);
      });
  }
};
