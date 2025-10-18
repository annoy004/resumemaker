import React from "react";
import { Layer, Rect, Text, Circle } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";

interface TemplateProps {
  name: string;
  designation: string;
  theme: { primary: string; fontFamily: string };
  onEdit: (field: "name" | "designation", value: string, e: KonvaEventObject<MouseEvent>) => void;
}

export default function CreativeTemplate({ name, designation, theme, onEdit }: TemplateProps) {
  return (
    <Layer>
      {/* Side color panel */}
      <Rect x={0} y={0} width={150} height={400} fill={theme.primary} opacity={0.15} />

      {/* Decorative circle */}
      <Circle x={75} y={75} radius={40} fill={theme.primary} opacity={0.2} />

      <Text
        text={name}
        x={180}
        y={80}
        fontSize={30}
        fontFamily={theme.fontFamily}
        fill={theme.primary}
        fontStyle="bold"
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("name", name, e)}
      />
      <Text
        text={designation}
        x={180}
        y={125}
        fontSize={18}
        fontFamily={theme.fontFamily}
        fill="#555"
        onClick={(e: KonvaEventObject<MouseEvent>) => onEdit("designation", designation, e)}
      />

      <Text
        text="Creative layout with side bar accent."
        x={180}
        y={170}
        fontSize={14}
        fill="#666"
        fontFamily={theme.fontFamily}
      />
    </Layer>
  );
}
