"use client";

import { useMemo, useState } from "react";
import { calculateEstimatedRanking } from "@/services/rankingCalculator";

export default function RankingCalculatorPage() {
  const [alan, setAlan] = useState<"Sayısal" | "Eşit Ağırlık" | "Sözel" | "Dil">("Sayısal");

  const [tyt, setTyt] = useState(70);
  const [ayt, setAyt] = useState(40);
  const [obp, setObp] = useState(85);

  const result2024 = useMemo(
    () =>
      calculateEstimatedRanking({
        alan,
        year: 2024,
        tyt,
        ayt,
        obp,
      }),
    [alan, tyt, ayt, obp]
  );

  const result2025 = useMemo(
    () =>
      calculateEstimatedRanking({
        alan,
        year: 2025,
        tyt,
        ayt,
        obp,
      }),
    [alan, tyt, ayt, obp]
  );

  const result2026 = useMemo(
    () =>
      calculateEstimatedRanking({
        alan,
        year: 2026,
        tyt,
        ayt,
        obp,
      }),
    [alan, tyt, ayt, obp]
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Sıralama Hesaplayıcı
      </h1>

      <div className="grid gap-4 md:grid-cols-2">

        <div>

          <label>Alan</label>

          <select
            className="w-full border rounded p-2"
            value={alan}
            onChange={(e) =>
              setAlan(
                e.target.value as any
              )
            }
          >
            <option>Sayısal</option>
            <option>Eşit Ağırlık</option>
            <option>Sözel</option>
            <option>Dil</option>
          </select>

        </div>

        <div>
          <label>OBP</label>

          <input
            type="number"
            value={obp}
            onChange={(e) =>
              setObp(Number(e.target.value))
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>TYT Neti</label>

          <input
            type="number"
            value={tyt}
            onChange={(e) =>
              setTyt(Number(e.target.value))
            }
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label>AYT Neti</label>

          <input
            type="number"
            value={ayt}
            onChange={(e) =>
              setAyt(Number(e.target.value))
            }
            className="w-full border rounded p-2"
          />
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-4">

        {[

          {
            year: 2024,
            result: result2024,
          },

          {
            year: 2025,
            result: result2025,
          },

          {
            year: 2026,
            result: result2026,
          },

        ].map((item) => (

          <div
            key={item.year}
            className="rounded-xl border p-5"
          >

            <h2 className="text-xl font-bold">
              {item.year}
            </h2>

            <div className="mt-4">

              <p className="text-sm text-gray-500">
                Tahmini Sıralama
              </p>

              <p className="text-3xl font-bold">
                {item.result.estimatedRank.toLocaleString("tr-TR")}
              </p>

            </div>

            <div className="mt-5 space-y-1">

              <p>
                TYT Hedef :
                {" "}
                {item.result.target
                  ? `${item.result.target.tytMin}-${item.result.target.tytMax}`
                  : "-"}
              </p>

              <p>
                AYT Hedef :
                {" "}
                {item.result.target
                  ? `${item.result.target.aytMin}-${item.result.target.aytMax}`
                  : "-"}
              </p>

              <p>
                Güven :
                %{item.result.confidence}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}