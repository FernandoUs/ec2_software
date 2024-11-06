import { calculateDistance } from "../../app/actions";
import { CityData, getCSVData } from "../../utils/csvLoader";

describe('calculateDistance', () => {
  it('should calculate the distance between two valid cities', async () => {
    const data: CityData[] = await getCSVData();
    const city1 = data.find(city => city.city === 'Tokyo');
    const city2 = data.find(city => city.city === 'Bangkok');

    const distance = await calculateDistance('Tokyo', 'Bangkok');

    // Si la distancia está en metros, conviértela a kilómetros
    const distanceInKm = distance / 1000; 

    // Ajusta el valor esperado en el test si es necesario
    expect(distanceInKm).toBeCloseTo(4603.923, 1); 
    expect(city1).toBeDefined(); 
    expect(city2).toBeDefined();
  });

  it('should throw an error if one of the cities is not found', async () => {
    await expect(calculateDistance('Tokyo', 'Vansapé')).rejects.toThrow('One or both cities not found in the CSV file');
  });

  it('should throw an error if the two cities are the same', async () => {
    await expect(calculateDistance('Tokyo', 'Tokyo')).rejects.toThrow('One or both cities not found in the CSV file');
  });
});
