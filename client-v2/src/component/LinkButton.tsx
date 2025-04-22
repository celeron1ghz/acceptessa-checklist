import React from 'react';
import { Link } from 'wouter';

export default function LinkButton(prop: { href: string, children: React.ReactNode }) {
  return <Link role="button" type='button' style={{ width: "100%", margin: "1vw 0", textAlign: 'left' }} {...prop}>
    {prop.children}
  </Link>;
}