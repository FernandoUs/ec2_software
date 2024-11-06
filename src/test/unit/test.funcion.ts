import { calculateDistance } from "@/app/actions";
import { CityData, getCSVData } from "@/utils/csvLoader";
import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

// Usa chai-as-promised
chai.use(chaiAsPromised);

describe('calculateDistance', () => {
  it('should calculate the distance between two valid cities', async () => {
    const data: CityData[] = await getCSVData();
    const city1 = data.find(city => city.city === 'Tokyo');
    const city2 = data.find(city => city.city === 'Bangkok');

    const distance = await calculateDistance('Tokyo', 'Bangkok');

    expect(distance).to.be.closeTo(2928.7, 0.1);
    expect(city1).to.not.be.undefined;
    expect(city2).to.not.be.undefined;
  });

  it('should throw an error if one of the cities is not found', async () => {
    await expect(calculateDistance('Tokyo', 'Vansapé')).to.be.rejectedWith('One or both cities not found in the CSV file');
  });

  it('should throw an error if the two cities are the same', async () => {
    await expect(calculateDistance('Tokyo', 'Tokyo')).to.be.rejectedWith('One or both cities not found in the CSV file');
  });
});
