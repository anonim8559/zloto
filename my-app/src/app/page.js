"use client";
import { ModeToggle } from "/src/components/switcher";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
} from "/src/components/ui/card";

export default function Ceny() {
  const [zloto, setZloto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("https://api.nbp.pl/api/cenyzlota/last/30/?format=json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const json = await response.json();
        setZloto(json);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  return (
    <div className="flex flex-row flex-wrap gap-3 pt-4 items-center justify-center h-screen">
      <ModeToggle />
      {zloto.map((cena, idx) => {
        const previousCena = idx > 0 ? zloto[idx - 1].cena : null;
        let Icon = null;
        let priceChange = null;

        if (previousCena) {
          priceChange = cena.cena - previousCena;
          Icon = priceChange > 0 ? (
            <TrendingUp className="text-green-500" width={40} height={40} />  
          ) : (
            <TrendingDown className="text-red-500" width={40} height={40} /> 
          );
        }

        return (
          <Card key={idx} className="p-0 w-[280px] h-[100px]">
            <CardContent className="p-0">
              <div className="p-2 flex flex-row justify-between ml-5 mr-5 mt-2 items-center">
                
               
                <div className="text-center flex flex-col items-center">
                  <h1 className="text-3xl font-semibold">{cena.cena.toFixed(2)} zł</h1>  
                  <h2 className="text-xl text-gray-600">{cena.data}</h2> 
                </div>

               
                {Icon && (
                  <div className="flex flex-col items-center">
                    {Icon}
                    <h3 className={`text-xl ${priceChange > 0 ? 'text-green-500' : 'text-red-500'}`}> 
                      {priceChange.toFixed(2)} zł
                    </h3>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
