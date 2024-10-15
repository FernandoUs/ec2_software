import { parse } from 'csv-parse/sync';

export interface CityData {
  city: string;
  city_ascii: string;
  lat: string;
  lng: string;
  // Añade aquí otros campos que necesites del CSV
}

let parsedData: CityData[] | null = null;

const CSV_URL = 'https://raw.githubusercontent.com/BlackMonkcr/ec2_software/refs/heads/main/public/worldcities.csv';

export async function getCSVData(): Promise<CityData[]> {
  if (parsedData) {
    return parsedData;
  }

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    
    parsedData = parse(csvText, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log('Parsed Data Length:', parsedData?.length ?? 0);
    console.log('First parsed item:', parsedData? parsedData[0] : null);
    
    return parsedData ?? [];
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    return [];
  }
}

export async function findCity(cityName: string): Promise<CityData | undefined> {
  const data = await getCSVData();
  console.log(`Buscando ciudad: ${cityName}`);
  console.log(`Número de ciudades en el CSV: ${data.length}`);
  const found = data.find(record => 
    record.city.toLowerCase() === cityName.toLowerCase() || 
    record.city_ascii.toLowerCase() === cityName.toLowerCase()
  );
  console.log(`Ciudad encontrada:`, found);
  return found;
}