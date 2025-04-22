import React from "react";

type PicoColor = 'red' | 'pink' | 'purple' | 'azure' | 'lime' | 'amber';

export default function Alert(prop: { color: PicoColor, children: React.ReactNode }) {
  return <div
    className={"pico-background-" + prop.color + "-100"}
    style={{
      padding: '2vw',
      marginBottom: '2vw',
      border: '1px solid var(--pico-color-' + prop.color + '-200)',
      color: 'var(--pico-color-' + prop.color + '-650)',
      borderRadius: '2vw',
      opacity: '0.7',
    }}
  >
    {prop.children}
  </div>
}