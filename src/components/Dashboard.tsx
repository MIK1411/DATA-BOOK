import { useEffect, useState, useMemo } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useOutletContext } from 'react-router-dom';
import { app, db } from '../lib/firebase';
import { censusData } from '../data/census';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Share2 } from 'lucide-react';

interface PresenceData {
  uid: string;
  name: string;
  lastActive: any;
  selectedState?: string;
  currentPath?: string;
}

export default function Dashboard() {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  const { activeUsers } = useOutletContext<{ activeUsers: PresenceData[] }>();
  
  const [selectedStateName, setSelectedStateName] = useState<string>("Uttar Pradesh");

  // Formatters
  const formatNumber = (num: number) => new Intl.NumberFormat('en-IN').format(num);
  const formatCompact = (num: number) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
    if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
    return formatNumber(num);
  };

  // Real-time Shared State sync
  useEffect(() => {
    if (!currentUser) return;
    
    const sharedRef = doc(db, 'workspace', 'shared');
    const unsub = onSnapshot(sharedRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.selectedState) {
          setSelectedStateName(data.selectedState);
        }
      }
    });

    return () => unsub();
  }, [currentUser]);

  const handleStateSelect = async (stateName: string) => {
    if (stateName === selectedStateName) return;
    setSelectedStateName(stateName);
    
    // Update shared workspace
    const sharedRef = doc(db, 'workspace', 'shared');
    await setDoc(sharedRef, { selectedState: stateName }, { merge: true });

    // Update own presence indicator
    if (currentUser) {
      const presenceRef = doc(db, 'presence', currentUser.uid);
      await setDoc(presenceRef, { selectedState: stateName }, { merge: true });
    }
  };

  const selectedData = useMemo(() => {
    return censusData.find(s => s.state === selectedStateName) || censusData[0];
  }, [selectedStateName]);

  const topStates = censusData.slice(0, 10);

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden animate-in fade-in duration-700">
      {/* Left Column: Data Selection & Visualization */}
      <div className="w-full lg:w-7/12 xl:w-2/3 flex flex-col border-b lg:border-b-0 lg:border-r border-[#1A1A1A] lg:overflow-hidden">
        <div className="p-4 sm:p-8 lg:p-12 space-y-8 lg:space-y-12 lg:overflow-y-auto no-scrollbar pb-12 lg:pb-24">
          
          <div className="space-y-2 lg:space-y-4">
            <h2 className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#666666] font-medium">Population Distribution</h2>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-tighter text-[#F2F2F2] max-w-xl">
              Exploring demographic density across India's most populous states.
            </p>
          </div>

          {/* Chart Area */}
          <div className="h-[250px] sm:h-[350px] lg:h-[400px] w-full mt-8 lg:mt-12 bg-[#0F0F0F] p-2 sm:p-4 lg:p-6 border border-[#1F1F1F] relative overflow-hidden flex items-center justify-center">
            <div className='absolute inset-0 opacity-20' style={{backgroundImage: 'radial-gradient(#A68B5C 0.5px, transparent 0.5px)', backgroundSize: '20px 20px'}}></div>
            <div className="relative z-10 w-full h-full border border-[#1A1A1A] p-2 sm:p-4 bg-[#0F0F0F]/80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topStates} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="state" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888888', fontSize: 9, fontFamily: 'monospace' }}
                    dy={10}
                    hide={window.innerWidth < 640} // Hide text on small mobile, too squished
                  />
                  <Tooltip 
                    cursor={{ fill: '#1A1A1A' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#111111] text-[#F2F2F2] px-3 sm:px-4 py-2 sm:py-3 border border-[#262626]">
                            <p className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#A68B5C] uppercase mb-1">{payload[0].payload.state}</p>
                            <p className="text-lg sm:text-xl font-serif">{formatCompact(payload[0].value as number)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="population" 
                    radius={[0, 0, 0, 0]}
                    onClick={(data) => handleStateSelect(data.state)}
                    className="cursor-pointer transition-all"
                  >
                    {topStates.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.state === selectedStateName ? '#A68B5C' : '#262626'} 
                        className="transition-colors duration-500 ease-out hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* State Grid */}
          <div className="space-y-4 lg:space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <h3 className="text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-[#666666]">Regional Distribution Matrix</h3>
                <div className="flex items-center text-[8px] sm:text-[9px] uppercase tracking-widest text-[#444444] space-x-2">
                  <Share2 size={12} className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Syncs in real-time</span>
                </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
               {censusData.map(state => {
                 const isActive = state.state === selectedStateName;
                 const activeCollaborators = activeUsers.filter(u => u.selectedState === state.state && u.uid !== currentUser?.uid);
                 
                 return (
                   <button
                     key={state.state}
                     onClick={() => handleStateSelect(state.state)}
                     className={cn(
                       "relative text-left p-3 sm:p-4 border transition-all duration-300",
                       isActive 
                         ? "bg-[#0F0F0F] border-[#A68B5C] text-white z-10" 
                         : "bg-[#111111] border-[#1F1F1F] text-[#AAAAAA] hover:border-[#262626] hover:bg-[#1A1A1A]"
                     )}
                   >
                     <div className="text-[9px] sm:text-[11px] uppercase tracking-widest mb-1 truncate">{state.state}</div>
                     <div className={cn(
                       "text-base sm:text-lg font-light font-serif", 
                       isActive ? "text-[#A68B5C]" : "text-[#666666]"
                     )}>
                       {formatCompact(state.population)}
                     </div>
                     
                     {/* Indicator for other users viewing this state */}
                     {activeCollaborators.length > 0 && (
                       <div className="absolute top-0 right-0 -mt-1.5 -mr-1.5 flex -space-x-1">
                         {activeCollaborators.slice(0,3).map(u => (
                           <div key={u.uid} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-500 border-2 border-[#111111] flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.6)]" title={u.name}>
                             <span className="text-[6px] sm:text-[7px] text-black font-bold">{getInitials(u.name)[0]}</span>
                           </div>
                         ))}
                       </div>
                     )}
                   </button>
                 )
               })}
             </div>
          </div>

        </div>
      </div>

      {/* Right Column: Deep Dive */}
      <div className="w-full lg:w-5/12 xl:w-1/3 bg-[#141414] p-6 sm:p-8 lg:p-12 lg:overflow-y-auto no-scrollbar border-l border-[#1F1F1F] relative z-10">
         <div className="space-y-10 lg:space-y-16">
            
            {/* Header */}
            <div className="space-y-2 animate-in slide-in-from-right-4 fade-in duration-700" key={`header-${selectedData.state}`}>
              <div className="flex items-center space-x-2 sm:space-x-3 text-[9px] sm:text-[10px] uppercase tracking-widest text-[#666666] mb-2 sm:mb-4">
                <Activity size={14} className="text-[#A68B5C] w-3 h-3 sm:w-4 sm:h-4" />
                <span>Live Focus</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#EBEBEB] tracking-tighter leading-none">
                {selectedData.state}
              </h2>
            </div>

            {/* Huge Metric */}
            <div className="space-y-2 sm:space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100 fill-mode-both" key={`pop-${selectedData.state}`}>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#666666]">Aggregate Population</p>
              <div className="font-serif text-5xl sm:text-[4rem] xl:text-[5rem] font-light text-[#F2F2F2] leading-none tracking-tighter">
                {formatCompact(selectedData.population)}
              </div>
              <p className="text-[#444444] text-[9px] sm:text-[11px] font-mono italic">
                Accounting for a significant portion of India's demographic footprint.
              </p>
            </div>

            {/* Grid Metrics */}
            <div className="space-y-6 sm:space-y-8 border-t border-[#1A1A1A] pt-8 sm:pt-10">
              <MetricBlock 
                label="Density" 
                value={`${selectedData.density}`} 
                suffix=" / sq km"
                delay="delay-200"
                state={selectedData.state}
              />
              <MetricBlock 
                label="Literacy Rate" 
                value={`${selectedData.literacy}%`} 
                delay="delay-300"
                state={selectedData.state}
              />
              <MetricBlock 
                label="Gender Ratio" 
                value={`${selectedData.sexRatio}`} 
                suffix=" : 1000"
                delay="delay-500"
                state={selectedData.state}
              />
            </div>
         </div>
      </div>

    </div>
  );
}

function MetricBlock({ label, value, suffix, delay, state }: { label: string, value: string, suffix?: string, delay: string, state: string }) {
  return (
    <div className={cn("flex justify-between items-end border-b border-[#1A1A1A] pb-2 animate-in slide-in-from-right-4 fade-in duration-700 fill-mode-both", delay)} key={`${label}-${state}`}>
      <span className="text-[13px] text-[#888888] font-serif italic">{label}</span>
      <span className="text-xl font-light text-[#A68B5C]">
        {value}
        {suffix && <span className="text-[10px] text-[#444444] font-mono ml-1">{suffix}</span>}
      </span>
    </div>
  );
}
