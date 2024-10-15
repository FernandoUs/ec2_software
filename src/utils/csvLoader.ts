import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface CityData {
    city: string;
    city_ascii: string;
    lat: string;
    lng: string;
    // Añade aquí otros campos que necesites del CSV
}

let parsedData: CityData[] | null = null;

export function getCSVData(): CityData[] {
    if (parsedData) {
        return parsedData;
    }

    const csvFilePath = path.join(process.cwd(), 'public', 'worldcities.csv');
    console.log('CSV File Path:', csvFilePath);

    try {
        const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
        console.log('CSV File Content (first 100 chars):', fileContent.substring(0, 100));

        parsedData = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        console.log('Parsed Data Length:', parsedData?.length ?? 0);
        console.log('First parsed item:', parsedData ? parsedData[0] : null);

        return parsedData ?? [];
    } catch (error) {
        console.error('Error reading or parsing CSV:', error);
        return [];
    }
}

export function findCity(cityName: string): CityData | undefined {
    const data = getCSVData();
    console.log(`Buscando ciudad: ${cityName}`);
    console.log(`Número de ciudades en el CSV: ${data.length}`);
    const found = data.find(record =>
        record.city.toLowerCase() === cityName.toLowerCase() ||
        record.city_ascii.toLowerCase() === cityName.toLowerCase()
    );
    console.log(`Ciudad encontrada:`, found);
    return found;
}