import React from 'react';
import { Offer, OfferAnalysis } from '../types';
import { ShieldCheck, AlertTriangle, Truck, DollarSign } from 'lucide-react';

interface ComparisonProps {
  offer1: Offer;
  offer2: Offer;
  analysis1: OfferAnalysis;
  analysis2: OfferAnalysis;
  currency: string;
}

export const ComparisonCard: React.FC<ComparisonProps> = ({
  offer1, offer2, analysis1, analysis2, currency
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mt-8">
      <div className="bg-gradient-to-r from-teal-600 to-indigo-700 p-5 rounded-t-3xl">
        <h3 className="text-white font-bold text-lg flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-200" />
          Deep Dive: Top 2 Contenders
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
        {/* Offer 1 */}
        <div className="p-8 relative bg-gradient-to-b from-teal-50 to-white">
          <div className="absolute top-0 right-0 bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-extrabold text-sm px-4 py-1.5 rounded-bl-xl shadow-md">
            #{offer1.rank} Recommended
          </div>
          <h4 className="font-extrabold text-2xl text-slate-800 mb-1">{offer1.seller}</h4>
          <div className="text-4xl font-extrabold text-emerald-600 mb-4">
            {currency} {offer1.total_landed_price.toFixed(2)}
          </div>
          
          <div className="space-y-5">
             <div>
                <p className="text-sm font-bold text-slate-600 uppercase mb-1">Why this wins</p>
                <ul className="space-y-1">
                    {analysis1.pros.map((pro, i) => (
                        <li key={i} className="text-base text-slate-700 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">✓</span> {pro}
                        </li>
                    ))}
                </ul>
             </div>

             <div>
                <p className="text-sm font-bold text-slate-600 uppercase mb-1">Trade-offs</p>
                <ul className="space-y-1">
                    {analysis1.cons.map((con, i) => (
                        <li key={i} className="text-base text-slate-700 flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">×</span> {con}
                        </li>
                    ))}
                </ul>
             </div>
             
             <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                 <p className="text-xs text-slate-500">Best for</p>
                 <p className="text-lg font-semibold text-teal-800">{analysis1.best_for}</p>
             </div>
          </div>
        </div>

        {/* Offer 2 */}
        <div className="p-8">
          <h4 className="font-extrabold text-2xl text-slate-800 mb-1">{offer2.seller}</h4>
           <div className="text-4xl font-extrabold text-purple-700 mb-4">
            {currency} {offer2.total_landed_price.toFixed(2)}
          </div>

          <div className="space-y-5">
             <div>
                <p className="text-sm font-bold text-slate-600 uppercase mb-1">Pros</p>
                <ul className="space-y-1">
                    {analysis2.pros.map((pro, i) => (
                        <li key={i} className="text-base text-slate-700 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">✓</span> {pro}
                        </li>
                    ))}
                </ul>
             </div>

             <div>
                <p className="text-sm font-bold text-slate-600 uppercase mb-1">Cons</p>
                <ul className="space-y-1">
                    {analysis2.cons.map((con, i) => (
                        <li key={i} className="text-base text-slate-700 flex items-start gap-2">
                            <span className="text-orange-500 mt-0.5">×</span> {con}
                        </li>
                    ))}
                </ul>
             </div>

             <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                 <p className="text-xs text-slate-500">Best for</p>
                 <p className="text-lg font-semibold text-purple-800">{analysis2.best_for}</p>
             </div>
          </div>
        </div>
      </div>
      
      {/* Footer Matrix */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border-t border-zinc-200 p-5 rounded-b-3xl text-center">
        <p className="text-base text-slate-700">
           <span className="font-bold">Verdict:</span> {offer1.seller} wins on <span className="font-extrabold text-emerald-600">Price</span>. {offer2.seller} competes on <span className="font-extrabold text-purple-600">Speed</span>.
        </p>
      </div>
    </div>
  );
};