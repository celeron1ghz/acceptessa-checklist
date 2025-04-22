import React from "react";

export default function Container(prop: { children: React.ReactNode }) {
  return <div className='container' style={{ paddingTop: '8vh' }}>
    {prop.children}
  </div>
}