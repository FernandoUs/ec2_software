'use client';

import { useState } from "react";
import { calculateDistance } from './actions';

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function Home() {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [metodo, setMetodo] = useState(3);
  const [prevCity1, setPrevCity1] = useState("");
  const [prevCity2, setPrevCity2] = useState("");
  const [prevMetodo, setPrevMetodo] = useState(3);
  const [distance, setDistance] = useState<null | number>(null);
  const [error, setError] = useState<null | string>(null);

  const calcularDistancia = () => {
    if (city1 === "" || city2 === "") {
      setError("Por favor, ingrese las ciudades");
      return 0;
    }
    switch (metodo) {
      case 1:
        const result = async () => {
          try {
            const distance = await calculateDistance(city1, city2);
            return distance;
          } catch (error: any) {
            setError("No se encontraron las ciudades");
            return 0;
          }
        }
        return result();
      case 2:
        const getPoint1 = async () => {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city1.toLocaleLowerCase()}&format=json`);
          const data = await response.json();
          setCity1(capitalize(data[0]?.name));
          return [Number(data[0]?.lat) ?? 0, Number(data[0]?.lon) ?? 0];
        }

        const getPoint2 = async () => {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city2.toLocaleLowerCase()}&format=json`);
          const data = await response.json();
          setCity2(capitalize(data[0]?.name));
          return [Number(data[0]?.lat) ?? 0, Number(data[0]?.lon) ?? 0];
        }

        const getDistance = async () => {
          const point1 = await getPoint1();
          const point2 = await getPoint2();
          const R = 6371e3;
          const φ1 = point1[0] * Math.PI / 180;
          const φ2 = point2[0] * Math.PI / 180;
          const Δφ = (point2[0] - point1[0]) * Math.PI / 180;
          const Δλ = (point2[1] - point1[1]) * Math.PI / 180;

          const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          const d = R * c;

          return Math.round(d);
        }

        return getDistance();
      case 3:
        return 1000;
      default:
        alert("Metodo no valido");
        return 0;
    };
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-center min-h-screen p-4 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-start bg-white text-black p-10 sm:py-20 rounded-3xl">
        <h1 className="text-4xl font-bold">Calcula la distancia entre 2 ciudades</h1>
        <p>1. Selecciona las ciudades y calcula la distancia entre ellas.</p>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 w-full pb-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="city1">Ciudad 1</label>
            <input value={city1} onChange={(value) => setCity1(capitalize(value.target.value))} type="text" className="border border-gray-900 rounded-md p-2 text-black outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="city2">Ciudad 2</label>
            <input value={city2} onChange={(value) => setCity2(capitalize(value.target.value))} type="text" className="border border-gray-900 rounded-md p-2 text-black outline-none" />
          </div>
        </div>
        <p>2. Escoge el metodo a utilizar</p>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 w-full pb-5">
          <select name="metodo" id="metodo" value={metodo} onChange={(value) => setMetodo(Number(value.target.value))} className="border border-gray-900 rounded-md p-2 text-black outline-none">
            <option value="1">Buscar en CSV</option>
            <option value="2">Usar API</option>
            <option value="3">Mock (Default value)</option>
          </select>
        </div>
        <button onClick={
          async () => {
            setError(null);
            const distance = Math.round((await calcularDistancia()) / 1000);
            setDistance(distance);
            setPrevCity1(city1);
            setPrevCity2(city2);
            setPrevMetodo(metodo);
          }
        } className="bg-black text-white text-xl font-medium rounded-md p-2 px-8 w-full sm:w-auto">Calcular</button>
        {
          distance !== null && !error && (
            <p className="text-2xl font-semibold">
              {prevMetodo === 3 ? `La distancia entre ${prevCity1} y ${prevCity2} es de ${distance} Km (Mock)` : `La distancia entre ${prevCity1} y ${prevCity2} es de ${distance} Km`}
            </p>
          )
        }
        {
          error && (
            <p className="text-red-500">{error}</p>
          )
        }
      </main>
    </div>
  );
}
