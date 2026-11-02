"use client";
import {useState} from 'react';
import Link from '@/components/link';
import {priceExamples, estimate} from '@/lib/catalog';
const usd = (n:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
export default function PriceExamples(){
  const [units,setUnits]=useState(48);
  return <section className="section price-section" id="cabinet-costs" aria-labelledby="price-heading">
    <div className="section-heading"><div><div className="eyebrow">PUT NUMBERS TO YOUR NEXT PROJECT</div><h2 id="price-heading">What do apartment cabinets cost?</h2><p>Start with three transparent examples. Then adjust the numbers to fit your plans.</p></div><label className="field price-quantity">Example project size<select value={units} onChange={e=>setUnits(Number(e.target.value))}><option value={12}>12 apartments</option><option value={48}>48 apartments</option><option value={100}>100 apartments</option></select></label></div>
    <p className="price-disclosure">Illustrative budgets—not supplier quotes or market averages. Every example assumes $180 per kitchen cabinet and $380 per vanity. Actual materials, dimensions, finish, hardware and supplier pricing will vary.</p>
    <div className="price-grid">{priceExamples.map(example=>{const v={...example.inputs,units};const r=estimate(v);return <article className="price-card" key={example.id}><small>{example.name.toUpperCase()}</small><h3>{usd(r.kitchen)}<span>kitchen cabinet materials / apartment</span></h3><p>{example.description}</p><div className="price-basis">{v.cabinets} cabinets × {usd(v.cost)} assumed each</div><dl><div><dt>Vanity materials ({v.baths})</dt><dd>{usd(v.baths*v.vanity)}</dd></div><div><dt>Freight allowance (8%)</dt><dd>{usd(r.freight/units)}</dd></div><div><dt>Installation allowance</dt><dd>{usd(v.install)}</dd></div><div><dt>Contingency (10%)</dt><dd>{usd(r.contingency/units)}</dd></div></dl><div className="price-unit"><span>Budget per apartment</span><strong>{usd(r.perUnit)}</strong></div><div className="price-project"><span>{units}-apartment project budget</span><strong>{usd(r.total)}</strong></div><Link className="button" href={`/estimator?example=${example.id}&units=${units}`}>Adjust this example ↗</Link></article>})}</div>
    <p className="fine">Vanities are cabinet materials only. Kitchen figures exclude vanity materials and all allowances. Project totals include the listed allowances; freight applies to kitchen and vanity materials, and contingency applies to materials, freight and installation. Figures are rounded for display. Excludes countertops, sinks, faucets, appliances, tax, demolition and storage. A cabinet count is not a dimensioned bill of materials.</p>
    <div className="price-next"><span>Have a cabinet schedule? Get pricing for your actual scope.</span><Link className="text-link" href="/quote">Request supplier quotes ↗</Link></div>
  </section>;
}
