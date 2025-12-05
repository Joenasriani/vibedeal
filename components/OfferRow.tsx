import React from 'react';
import { Offer } from '../types';
import { Star, Truck, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface OfferRowProps {
  offer: Offer;
  currency: string;
}

export const OfferRow: React.FC<OfferRowProps> = ({ offer, currency }) => {
  const isTopRank = offer.rank === 1;

  return (
    <div className={`
      relative grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center
      bg-white rounded-xl shadow-md hover:shadow-lg transition-all mb-4 last:mb-0
      ${isTopRank ? 'bg-gradient-to-b from-teal-50 to-white border-2 border-teal-400' : 'border border-slate-100'}
    `}>
      {/* Rank & Seller */}
      <div className="md:col-span-3 flex items-center gap-3">
        <div className={`
          w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-lg shrink-0
          ${isTopRank ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'}
        `}>
          {offer.rank}
        </div>
        <div>
          <h4 className="font-bold text-lg text-slate-800 leading-tight">{offer.seller}</h4>
          <div className="flex items-center text-sm text-zinc-500 mt-0.5">
            <Star className="w-4 h-4 text-orange-400 fill-orange-400 mr-1" />
            <span>{offer.seller_rating} ({offer.review_count})</span>
            {offer.distance_km > 0 && (
               <span className="ml-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {offer.distance_km}km
               </span>
            )}
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="md:col-span-3 text-sm">
        <div className="flex justify-between md:block">
           <span className="md:hidden text-slate-600">Price:</span>
           <span className="text-slate-800 font-medium">Item: {currency}{offer.item_price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between md:block text-zinc-500 text-sm">
            <span className="md:hidden">Shipping:</span>
            <span>+ {offer.shipping_cost === 0 ? 'Free Ship' : `${currency}${offer.shipping_cost.toFixed(2)}`}</span>
        </div>
      </div>

      {/* Total & Stock */}
      <div className="md:col-span-3">
        <div className="flex justify-between items-center md:items-start md:flex-col">
            <div className="text-3xl font-extrabold text-teal-700">
                {currency} {offer.total_landed_price.toFixed(2)}
            </div>
            <div className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block mt-1
                ${offer.stock_status === 'in_stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}
            `}>
                {offer.stock_status.replace('_', ' ').toUpperCase()}
            </div>
        </div>
      </div>

      {/* Verification & Action */}
      <div className="md:col-span-3 flex flex-col md:items-end gap-2">
         <div className="text-sm text-zinc-500 flex items-center gap-1">
            <Truck className="w-4 h-4" /> ETA: {offer.delivery_eta}
         </div>
         {offer.risk_level !== 'low' && (
            <div className="text-sm text-orange-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-4 h-4" /> Risk: {offer.risk_level}
            </div>
         )}
         <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
             <a href={offer.url} target="_blank" rel="noreferrer" className="flex-1 md:flex-none text-center bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-teal-200 transition-all">
                View Deal
             </a>
         </div>
         <span className="text-xs text-zinc-400">Verified: {offer.verification_notes.split(';')[0]}</span>
      </div>
    </div>
  );
};