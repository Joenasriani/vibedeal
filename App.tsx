import React, { useState } from 'react';
import { Search, MapPin, Sliders, Activity, Info, ChevronDown, ChevronUp, Code, DollarSign, Loader2, CheckCircle, LocateFixed, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SearchParams, VibeDealResponse, OptionalFeatures } from './types';
import { fetchDeals } from './services/geminiService';
// OfferRow and ComparisonCard are no longer directly populated from the model's text response due to grounding integration
// import { OfferRow } from './components/OfferRow';
// import { ComparisonCard } from './components/ComparisonCard';
import { GenerateContentResponse } from "@google/genai"; // Import GenerateContentResponse for type safety
import ReactMarkdown from 'react-markdown'; // For rendering markdown content

const INITIAL_FEATURES: OptionalFeatures = {
  price_history: true,
  price_prediction: false,
  review_quality: true,
  loyalty_scan: false,
  seller_risk_filter: true,
  stock_alerts: false,
  image_barcode_mode: false,
  price_match_support: false,
};

const App: React.FC = () => {
  // Input State
  const [product, setProduct] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState(50);
  const [currency, setCurrency] = useState('USD');
  const [condition, setCondition] = useState('new');
  const [features, setFeatures] = useState<OptionalFeatures>(INITIAL_FEATURES);
  const [showFilters, setShowFilters] = useState(false);

  // App State
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  // data now stores the raw GenerateContentResponse
  const [data, setData] = useState<GenerateContentResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showJson, setShowJson] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setErrorMsg("Delivery Location is required for accurate landed price.");
      setStatus('error');
      return;
    }
    
    setStatus('loading');
    setErrorMsg('');
    setData(null);

    try {
      const searchParams: SearchParams = {
        product_query: product,
        delivery_location: location,
        max_distance_km: distance,
        currency,
        condition,
        budget_min: null,
        budget_max: null,
        optional_features: features,
      };

      // fetchDeals now returns GenerateContentResponse directly
      const result = await fetchDeals(searchParams);
      setData(result);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate deals. Please check your API Key and try again.");
      setStatus('error');
    }
  };

  const toggleFeature = (key: keyof OptionalFeatures) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser");
      setStatus('error');
      return;
    }
    
    // Clear previous errors
    setErrorMsg('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Format coordinates to a string the AI can understand
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      },
      (error) => {
        console.error("Location error:", error);
        setErrorMsg("Unable to retrieve your location. Please check browser permissions.");
        setStatus('error');
      }
    );
  };

  // Helper to get grounding chunks
  const groundingChunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks;

  return (
    <div className="min-h-screen text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-indigo-700 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 text-white p-1.5 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">VibeDeal</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-teal-200">
             <span className="hidden sm:inline">Discovery Engine v1.0</span>
             <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center border border-teal-500" title={`Currency: ${currency}`}>
                <span className="font-bold text-xs">{currency.slice(0, 2)}</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Find the best landed price.<br/>Locally & Globally.</h1>
            <p className="text-slate-600 text-lg">Real-time inventory, shipping calculation, and trust verification.</p>
          </div>

          <form onSubmit={handleSearch} className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative col-span-1 md:col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Product name, model, or SKU..."
                    className="block w-full pl-10 pr-3 py-3 border border-teal-300 rounded-2xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex gap-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="where are you now?"
                      className="block w-full pl-10 pr-3 py-3 border border-teal-300 rounded-2xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    className="px-3 py-3 bg-teal-100 border border-teal-200 rounded-2xl hover:bg-teal-200 text-teal-700 transition-colors"
                    title="Use my location"
                  >
                    <LocateFixed className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex gap-2 w-full md:col-span-2">
                   <select 
                     className="block w-1/2 py-3 px-3 border border-teal-300 bg-white rounded-2xl focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                     value={currency}
                     onChange={(e) => setCurrency(e.target.value)}
                   >
                     <option value="USD">USD</option>
                     <option value="EUR">EUR</option>
                     <option value="GBP">GBP</option>
                     <option value="JPY">JPY</option>
                     <option value="AED">AED</option>
                     <option value="LBP">LBP</option>
                   </select>
                   <select 
                     className="block w-1/2 py-3 px-3 border border-teal-300 bg-white rounded-2xl focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                     value={condition}
                     onChange={(e) => setCondition(e.target.value)}
                   >
                     <option value="new">New</option>
                     <option value="refurbished">Refurbished</option>
                     <option value="used">Used</option>
                   </select>
                </div>
             </div>

             <div className="flex items-center justify-between pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-sm text-teal-600 hover:text-teal-800 font-semibold transition-colors"
                >
                  <Sliders className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide Advanced' : 'Advanced Options'}
                </button>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="group bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-2xl shadow-xl shadow-teal-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin mr-2 group-hover:rotate-180 transition-transform duration-300" /> : null}
                  {status === 'loading' ? 'Scanning...' : 'Search Deals'}
                </button>
             </div>

             {showFilters && (
               <div className="mt-6 pt-6 border-t border-teal-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(features).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={() => toggleFeature(key as keyof OptionalFeatures)}
                        className="rounded text-teal-600 focus:ring-teal-500 border-slate-300 w-4 h-4"
                      />
                      <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                  <div className="col-span-2 sm:col-span-4 mt-2">
                     <label className="text-sm text-slate-600 block mb-1">Max Distance: {distance} km</label>
                     <input 
                        type="range" min="5" max="500" step="5" 
                        value={distance} 
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer accent-teal-500"
                      />
                  </div>
               </div>
             )}
          </form>

          {status === 'error' && (
             <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-xl border border-red-200 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                {errorMsg}
             </div>
          )}
        </div>

        {/* Results Section */}
        {status === 'success' && data && (
          <div className="animate-fade-in space-y-8">
            
            {/* IMPORTANT DISCLAIMER */}
            <div className="p-5 bg-orange-100 border border-orange-300 text-orange-800 rounded-xl flex items-start gap-3">
               {/* Fix: Add AlertCircle import */}
               <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
               <div>
                 <h3 className="font-bold text-lg mb-1">Important: Search Grounding Enabled!</h3>
                 <p className="text-sm">
                   To provide active and original links, this application now uses real-time Google Search grounding.
                   This means the model's primary output is a natural language description, and structured data for detailed offer cards (like individual `OfferRow` and `ComparisonCard` components) cannot be automatically populated from the response text.
                   Verified links are displayed below in the "Grounded Sources" section.
                 </p>
               </div>
            </div>

            {/* Model's Natural Language Response */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 prose prose-teal max-w-none">
                <ReactMarkdown>{data.text || "No descriptive text available."}</ReactMarkdown>
            </div>

            {/* Grounded Sources */}
            {groundingChunks && groundingChunks.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-8">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2 text-blue-600" />
                  Grounded Sources (Verified Links)
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                  {groundingChunks.map((chunk, idx) => (
                    <li key={idx}>
                      {chunk.web ? (
                        <a 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 underline break-words"
                          title={chunk.web.title || chunk.web.uri}
                        >
                          {chunk.web.title || chunk.web.uri}
                        </a>
                      ) : chunk.maps ? (
                        <a 
                          href={chunk.maps.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 underline break-words"
                          title={chunk.maps.title || chunk.maps.uri}
                        >
                          {chunk.maps.title || chunk.maps.uri} (Maps)
                        </a>
                      ) : (
                        <span>Unknown grounding source.</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* JSON Viewer (Developer Mode) */}
            <div className="border-t border-slate-200 pt-8 mt-12">
               <button 
                 onClick={() => setShowJson(!showJson)}
                 className="flex items-center text-slate-600 text-sm hover:text-teal-700 font-medium transition-colors mb-4"
               >
                 <Code className="w-4 h-4 mr-2" />
                 {showJson ? 'Hide Raw GenerateContentResponse JSON' : 'Show Raw GenerateContentResponse JSON'}
                 {showJson ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
               </button>
               
               {showJson && (
                 <div className="bg-gray-800 rounded-xl p-6 overflow-hidden">
                    <pre className="text-xs text-teal-200 font-mono overflow-auto max-h-96 json-scroll">
                       {JSON.stringify(data, null, 2)}
                    </pre>
                 </div>
               )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;