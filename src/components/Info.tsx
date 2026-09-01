import { Activity, ShieldCheck, AlertTriangle, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Info() {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 sm:p-8 lg:p-12 animate-in fade-in duration-700 bg-[#0D0D0D]">
      <div className="max-w-6xl mx-auto space-y-10 lg:space-y-16 pb-16 lg:pb-24">
        
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <h2 className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#666666] font-semibold mb-2">Census 2027 Guidelines</h2>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#EBEBEB]">
            Information & Security
          </h1>
          <div className="w-16 h-px bg-[#A68B5C] mt-4 lg:mt-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Phases Section */}
          <div className="space-y-6 lg:space-y-8">
            <div className="flex items-center space-x-2 sm:space-x-3 text-[#A68B5C] border-b border-[#1A1A1A] pb-3 sm:pb-4">
              <Activity size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">The Two Phases of Census 2027</h3>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-[#111111] border border-[#1F1F1F] p-4 sm:p-6 hover:border-[#A68B5C] transition-colors">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#A68B5C] mb-2 font-mono">Phase 1</div>
                <h4 className="font-serif text-xl sm:text-2xl text-[#EBEBEB] mb-2 sm:mb-3">House Listing & Housing Census</h4>
                <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed mb-4">
                  Focuses on identifying and listing all structures, houses, and households. Collects vital data regarding housing conditions, household amenities, and assets owned by the household.
                </p>
                <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#262626] text-[8px] sm:text-[9px] uppercase tracking-widest text-[#888888]">
                  Schedule: April - September 2027
                </div>
              </div>

              <div className="bg-[#111111] border border-[#1F1F1F] p-4 sm:p-6 hover:border-[#A68B5C] transition-colors">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#A68B5C] mb-2 font-mono">Phase 2</div>
                <h4 className="font-serif text-xl sm:text-2xl text-[#EBEBEB] mb-2 sm:mb-3">Population Enumeration</h4>
                <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed mb-4">
                  Involves the actual counting of the population. Captures detailed demographic, socio-economic, cultural, and migration particulars of every individual residing in the country.
                </p>
                <div className="inline-block px-3 py-1 bg-[#1A1A1A] border border-[#262626] text-[8px] sm:text-[9px] uppercase tracking-widest text-[#888888]">
                  Schedule: February 9 - February 28, 2028
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Misinformation */}
          <div className="space-y-6 lg:space-y-8">
             <div className="flex items-center space-x-2 sm:space-x-3 text-[#A68B5C] border-b border-[#1A1A1A] pb-3 sm:pb-4">
              <ShieldCheck size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
              <h3 className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">Data Privacy & Misinformation</h3>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-[#111111] border border-[#1F1F1F] p-4 sm:p-6">
                <h4 className="font-serif text-lg sm:text-xl text-[#F2F2F2] mb-2 sm:mb-3 flex items-center">
                  <ShieldCheck size={16} className="text-emerald-500 mr-2 w-3 h-3 sm:w-4 sm:h-4" /> 
                  Strict Privacy Assured
                </h4>
                <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed">
                  All personal data collected during the digital enumeration is encrypted using advanced standard protocols (AES-256). Information is strictly aggregated for statistical analysis and policy making. Individual data is highly confidential and protected under the <span className="text-[#F2F2F2]">Census Act, 1948</span>. It cannot be used in a court of law against you.
                </p>
              </div>

              <div className="bg-[#141010] border border-[#3A1C1C] p-4 sm:p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <AlertTriangle size={64} className="text-red-500" />
                </div>
                <h4 className="font-serif text-lg sm:text-xl text-[#F2F2F2] mb-2 sm:mb-3 flex items-center text-red-400">
                  <AlertTriangle size={16} className="mr-2" /> 
                  Combating Misinformation
                </h4>
                <ul className="text-sm text-[#AAAAAA] space-y-3 relative z-10">
                  <li className="flex items-start">
                    <span className="text-[#A68B5C] mr-2">•</span>
                    <span><strong>Official Portal Only:</strong> Ensure you are on the official government domain before submitting any self-enumeration form.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#A68B5C] mr-2">•</span>
                    <span><strong>No OTP Requests:</strong> Official enumerators will never ask for your bank OTP, passwords, or financial credentials.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#A68B5C] mr-2">•</span>
                    <span><strong>Verified IDs:</strong> Field workers carrying tablets will always present a government-issued ID card and an official authorization letter.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* State-wise Survey Dates Table */}
        <div className="mt-16 space-y-8">
           <div className="flex items-center space-x-3 text-[#A68B5C] border-b border-[#1A1A1A] pb-4">
            <Calendar size={20} />
            <h3 className="text-xs uppercase tracking-widest font-bold">State-wise Self-Enumeration Dates (Phase 1)</h3>
          </div>
          
          <div className="w-full overflow-x-auto border border-[#1F1F1F]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111111] text-[10px] uppercase tracking-widest text-[#666666]">
                  <th className="p-4 border-b border-[#1F1F1F] font-medium">Zone / Region</th>
                  <th className="p-4 border-b border-[#1F1F1F] font-medium">Included States (Sample)</th>
                  <th className="p-4 border-b border-[#1F1F1F] font-medium">Portal Open Date</th>
                  <th className="p-4 border-b border-[#1F1F1F] font-medium">Portal Close Date</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#F2F2F2]">
                <tr className="border-b border-[#1A1A1A] hover:bg-[#0F0F0F] transition-colors">
                  <td className="p-4 font-mono text-[#A68B5C]">Northern Zone</td>
                  <td className="p-4 text-[#AAAAAA]">Delhi, Haryana, Punjab, Himachal Pradesh</td>
                  <td className="p-4">April 1, 2027</td>
                  <td className="p-4">May 15, 2027</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] hover:bg-[#0F0F0F] transition-colors">
                  <td className="p-4 font-mono text-[#A68B5C]">Central Zone</td>
                  <td className="p-4 text-[#AAAAAA]">Uttar Pradesh, Madhya Pradesh, Chhattisgarh</td>
                  <td className="p-4">May 1, 2027</td>
                  <td className="p-4">June 15, 2027</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] hover:bg-[#0F0F0F] transition-colors">
                  <td className="p-4 font-mono text-[#A68B5C]">Western Zone</td>
                  <td className="p-4 text-[#AAAAAA]">Maharashtra, Gujarat, Rajasthan, Goa</td>
                  <td className="p-4">June 1, 2027</td>
                  <td className="p-4">July 15, 2027</td>
                </tr>
                <tr className="border-b border-[#1A1A1A] hover:bg-[#0F0F0F] transition-colors">
                  <td className="p-4 font-mono text-[#A68B5C]">Southern Zone</td>
                  <td className="p-4 text-[#AAAAAA]">Karnataka, Tamil Nadu, Kerala, Andhra Pradesh</td>
                  <td className="p-4">July 1, 2027</td>
                  <td className="p-4">August 15, 2027</td>
                </tr>
                <tr className="hover:bg-[#0F0F0F] transition-colors">
                  <td className="p-4 font-mono text-[#A68B5C]">Eastern Zone</td>
                  <td className="p-4 text-[#AAAAAA]">West Bengal, Bihar, Odisha, Jharkhand, NE States</td>
                  <td className="p-4">August 1, 2027</td>
                  <td className="p-4">September 15, 2027</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
