"use client";

import { NumberInput } from "@/components/ui/NumberInput";
import { Select } from "@/components/ui/Select";
import { FormSection } from "@/components/ui/FormSection";
import { FormRow } from "@/components/ui/FormRow";

interface Props {
  alan: string;
  setAlan: (value: any) => void;

  obp: number;
  setObp: (value: number) => void;

  tyt: number;
  setTyt: (value: number) => void;

  ayt: number;
  setAyt: (value: number) => void;
}

export function CalculatorForm({
  alan,
  setAlan,
  obp,
  setObp,
  tyt,
  setTyt,
  ayt,
  setAyt,
}: Props) {
  return (
    <FormSection title="Bilgiler">

      <FormRow>

        <Select
          label="Alan"
          value={alan}
          onChange={(e) => setAlan(e.target.value)}
        >
          <option value="Sayısal">Sayısal</option>
          <option value="Eşit Ağırlık">Eşit Ağırlık</option>
          <option value="Sözel">Sözel</option>
          <option value="Dil">Dil</option>
        </Select>

        <NumberInput
          label="OBP"
          value={obp}
          onChange={(e) => setObp(Number(e.target.value))}
        />

        <NumberInput
          label="TYT Neti"
          value={tyt}
          onChange={(e) => setTyt(Number(e.target.value))}
        />

        <NumberInput
          label="AYT Neti"
          value={ayt}
          onChange={(e) => setAyt(Number(e.target.value))}
        />

      </FormRow>

    </FormSection>
  );
}