// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import Box from './Box';
import { supportedCertivityApis, supportedCertivityApis_v4_map } from '../certivityApis';

// For bundling npm packages: Install them in the plugin directory
// For using host packages: Add them to EXTERNAL_PACKAGES in build.sh
// Example with external package (assumes dayjs is in host):
// const dayjs = require('dayjs');

/**
 * Plugin API provided by the host application
 * Limited to:
 * 1. Update model/prototype data
 * 2. Read & Write vehicle API information
 */
type PluginAPI = {
  // Model & Prototype Updates
  updateModel?: (updates: any) => Promise<any>;
  updatePrototype?: (updates: any) => Promise<any>;

  // Vehicle API Operations (Read)
  getComputedAPIs?: (model_id?: string) => Promise<any>;
  getApiDetail?: (api_name: string, model_id?: string) => Promise<any>;
  listVSSVersions?: () => Promise<string[]>;
};

type PageProps = {
  data?: any;
  config?: any;
  api?: PluginAPI;
};

// Regulation types
type Regulation = {
  key: string;
  titleShort: string;
  titleLong: string;
  type: string;
  region: string;
};

type RegulationSingle = {
  key: string;
  titleShort: string;
  titleLong: string;
};

type RegulationType = {
  name: string;
  regulations: RegulationSingle[];
};

type RegulationRegion = {
  name: string;
  types: RegulationType[];
};

const getApiTypeClasses = (type: string) => {
  switch (type) {
    case 'branch':
      return { bgClass: '', textClass: 'text-purple-500' }
    case 'actuator':
      return { bgClass: '', textClass: 'text-yellow-500' }
    case 'sensor':
      return { bgClass: '', textClass: 'text-emerald-500' }
    case 'attribute':
      return { bgClass: '', textClass: 'text-sky-500' }
    case 'Atomic Service':
      return { bgClass: '', textClass: 'text-purple-500' }
    case 'Basic Service':
      return { bgClass: '', textClass: 'text-emerald-500' }
    default:
      return { bgClass: '', textClass: 'text-da-gray-medium' }
  }
}

const logos = [
  {
    src: 'https://bewebstudio.digitalauto.tech/data/projects/TQUHL1DoUNoI/digital.auto.png',
    name: 'DigitalAuto',
    href: 'https://www.digital-auto.org/',
  },
  {
    src: 'https://bewebstudio.digitalauto.tech/data/projects/TQUHL1DoUNoI/certivity.png',
    name: 'Certivity',
    href: 'https://www.certivity.io/',
  },
  {
    src: 'https://bewebstudio.digitalauto.tech/data/projects/TQUHL1DoUNoI/AlephAlpha.png',
    name: 'Aleph Alpha',
    href: 'https://aleph-alpha.com/',
  },
  { src: 'https://bewebstudio.digitalauto.tech/data/projects/TQUHL1DoUNoI/ETAS.png', 
    name: 'ETAS', 
    href: 'https://www.etas.com/en/' },
]


export default function Page({ data, config, api }: PageProps) {

  const [selectedApis, setSelectedApis] = React.useState(new Set());
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [regulationRegions, setRegulationRegions] = React.useState([] as RegulationRegion[]);

  // Get API name (handle both string and object formats)
  const getApiName = (api: any): string => {
    return typeof api === 'string' ? api : api.name || '';
  };

  // Check if an API is supported by Certivity
  const isApiSupported = (apiName: string): boolean => {
    if (supportedCertivityApis.has(apiName)) {
      return true;
    }
    const mappedName = supportedCertivityApis_v4_map[apiName];
    return mappedName ? supportedCertivityApis.has(mappedName) : false;
  };

  // Sort APIs so supported ones appear first
  const vssApis = React.useMemo(() => {
    const vssApisData = data?.prototype?.apis?.VSS || [];
    // Sort: supported APIs first, then unsupported
    return [...vssApisData].sort((a, b) => {
      const aName = getApiName(a);
      const bName = getApiName(b);
      const aSupported = isApiSupported(aName);
      const bSupported = isApiSupported(bName);
      
      if (aSupported && !bSupported) return -1;
      if (!aSupported && bSupported) return 1;
      // If both have same support status, maintain original order
      return 0;
    });
  }, [data?.prototype?.apis?.VSS]);

  // Separate regulations by region, type and regulation
  const formatRegulations = (regulations: Regulation[]): RegulationRegion[] => {
    let formattedRegulations: RegulationRegion[] = [];

    regulations.forEach((regulation) => {
      // Regulation Region
      let region = formattedRegulations.find(
        (r) => r.name === regulation.region,
      );
      if (!region) {
        region = {
          name: regulation.region,
          types: [],
        };
        formattedRegulations.push(region);
      }

      // Regulation Type
      let type = region.types.find((t) => t.name === regulation.type);
      if (!type) {
        type = {
          name: regulation.type,
          regulations: [],
        };
        region.types.push(type);
      }

      // Regulation
      type.regulations.push({
        key: regulation.key,
        titleShort: regulation.titleShort,
        titleLong: regulation.titleLong,
      });
    });

    // Sort regulations by key
    formattedRegulations.forEach((region) => {
      region.types.forEach((type) => {
        type.regulations.sort((a, b) => {
          try {
            const aNum = parseInt(a.key.replace(/^[^0-9]+/g, ''));
            const bNum = parseInt(b.key.replace(/^[^0-9]+/g, ''));
            return aNum - bNum;
          } catch (error) {
            return a.key.localeCompare(b.key);
          }
        });
      });
    });

    return formattedRegulations;
  };

  // Process selected APIs and fetch regulations
  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        // Fetch regulations based on used APIs
        if (selectedApis.size > 0) {
          console.log('Selected APIs:', Array.from(selectedApis));
          
          // Filter and map selected APIs to supported Certivity APIs
          const supportedApiNames = Array.from(selectedApis)
            .map((apiName) => {
              const apiNameStr = apiName as string;
              const isDirectlySupported = supportedCertivityApis.has(apiNameStr);
              const mappedName = supportedCertivityApis_v4_map[apiNameStr];
              const result = isDirectlySupported ? apiNameStr : mappedName;
              console.log(`API: ${apiNameStr}, Directly supported: ${isDirectlySupported}, Mapped: ${mappedName}, Result: ${result}`);
              return result;
            })
            .filter((value) => {
              const isValid = value && supportedCertivityApis.has(value as string);
              console.log(`Filtering ${value}: ${isValid}`);
              return isValid;
            }) as string[];

          console.log('Supported API names after filtering:', supportedApiNames);

          if (supportedApiNames.length > 0) {
            // Make fetch request to homologation API
            const apiUrl = `https://service.homologation.digital.auto/regulations?vehicleApis=${supportedApiNames.join(',')}`;
            console.log('Fetching regulations from:', apiUrl);
            
            const response = await fetch(apiUrl, {
              method: 'GET',
              credentials: 'include',
            });

            console.log('Response status:', response.status, response.ok);

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const regulationsResponse: Regulation[] = await response.json();
            console.log('Regulations response:', regulationsResponse);
            
            if (!regulationsResponse || regulationsResponse.length === 0) {
              console.log('No regulations found in response');
              setRegulationRegions([]);
            } else {
              const formatted = formatRegulations(regulationsResponse);
              console.log('Formatted regulations:', formatted);
              setRegulationRegions(formatted);
            }
          } else {
            // No supported APIs selected
            console.log('No supported APIs found in selection');
            setRegulationRegions([]);
          }
        } else {
          console.log('No APIs selected');
          setRegulationRegions([]);
        }
      } catch (error) {
        setErrorMsg('Error fetching regulations');
        console.error('Error fetching regulations:', error);
        setRegulationRegions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedApis]);

  // Handle individual checkbox toggle
  const handleToggleApi = (apiName: string) => {
    setSelectedApis((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(apiName)) {
        newSet.delete(apiName);
      } else {
        newSet.add(apiName);
      }
      return newSet;
    });
  };

  // Handle select all (only supported APIs)
  const handleSelectAll = () => {
    const supportedApiNames = vssApis
      .map((api) => getApiName(api))
      .filter((apiName) => isApiSupported(apiName));
    
    const allSupportedSelected = supportedApiNames.length > 0 && 
      supportedApiNames.every((name) => selectedApis.has(name));
    
    if (allSupportedSelected) {
      // If all supported are selected, clear selection
      setSelectedApis(new Set());
    } else {
      // Select all supported APIs
      setSelectedApis(new Set(supportedApiNames));
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedApis(new Set());
  };

  // Get API type (ACTUATOR, SENSOR, etc.)
  const getApiType = (api: any): string => {
    if (typeof api === 'string') return 'ACTUATOR'; // Default if not specified
    return api.type || api.datatype || 'ACTUATOR';
  };

  // Initialize prototype name from data
  React.useEffect(() => {
    console.log('prototype data', data?.prototype);
  }, [data?.prototype]);

  React.useEffect(() => {
    console.log('model data', data?.model);
  }, [data?.model]);


  if (!data?.prototype?.name) {
    return (
      <div className="h-full w-full bg-slate-200 p-2 flex text-black"
        style={{}}>
        <div className="bg-white shadow-lg rounded-lg w-full h-full flex items-start justify-start px-4 py-4 overflow-auto">
          <h1 className="text-2xl font-bold text-slate-700">No Data Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-200 p-2 flex text-black"
      style={{}}>
      <div className="bg-white shadow-lg rounded-lg w-full h-full flex gap-4 px-4 py-4">
        <div className="w-1/2 h-full flex flex-col gap-4">
          <div className="flex-1 flex flex-col rounded-lg p-2"
            style={{ backgroundColor: 'rgba(225, 231, 239, 0.2)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-slate-700">Used Signals ({vssApis.length})</h2>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-sm cursor-pointer hover:opacity-60">
                  <input
                    type="checkbox"
                    checked={(() => {
                      const supportedApiNames = vssApis
                        .map((api) => getApiName(api))
                        .filter((apiName) => isApiSupported(apiName));
                      return supportedApiNames.length > 0 && 
                        supportedApiNames.every((name) => selectedApis.has(name));
                    })()}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span>Select all</span>
                </label>
                <button
                  onClick={handleClearSelection}
                  className="flex items-center gap-1 text-sm cursor-pointer hover:opacity-60"
                  title="Clear selection"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear selection</span>
                </button>
              </div>
            </div>

            {/* Signal List */}
            <div className="flex-1 overflow-auto">
              {vssApis.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No signals available</div>
              ) : (
                <div className="space-y-0.5">
                  {vssApis.map((api, index) => {
                    const apiName = getApiName(api);
                    const apiType = getApiType(api);
                    const isSelected = selectedApis.has(apiName);
                    const isSupported = isApiSupported(apiName);

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between py-1 px-2 rounded ${
                          isSupported 
                            ? 'hover:bg-slate-100' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!isSupported}
                            onChange={() => isSupported && handleToggleApi(apiName)}
                            className={`w-4 h-4 flex-shrink-0 ${
                              isSupported 
                                ? 'cursor-pointer' 
                                : 'cursor-not-allowed opacity-50'
                            }`}
                          />
                          <span className={`text-sm truncate ${
                            isSupported 
                              ? 'text-slate-700' 
                              : 'text-slate-400'
                          }`}>
                            {apiName}
                          </span>
                        </div>
                        <span className={`text-xs !font-medium uppercase select-none
                            px-2 py-1 rounded-full ${getApiTypeClasses(apiType).bgClass} ${getApiTypeClasses(apiType).textClass}`}>
                          {apiType}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="h-[160px] flex flex-col rounded-lg p-2"
            style={{ backgroundColor: 'rgba(225, 231, 239, 0.2)' }}>
            <h2 className="text-lg font-bold text-slate-700 mb-2">Vehicle Properties</h2>
            <div className="flex-1 overflow-auto">
              {data?.model?.vehicle_category && <div className="flex font-medium items-center gap-2"
                style={{ gap: '10px', fontSize: '14px' }}>
                <div>Category: </div>
                <div className="font-bold">{data?.model?.vehicle_category}</div>
              </div>}
            </div>
          </div>

          <div className="h-[100px] rounded-lg p-2 flex flex-col"
            style={{ }}>
            <p className="text-center flex-shrink-0 text-xs">
              This prototype is powered by
            </p>
            <div className="flex w-full h-full items-center justify-center"
            style={{ gap: '20px', backgroundColor: 'white' }}>
              {logos.map((logo) => (
                <a
                  className="transition cursor-pointer"
                  key={logo.name}
                  href={logo.href}
                  target="__blank"
                >
                  <img
                    src={logo.src}
                    className="w-full object-contain"
                    style={{ height: 'auto', maxHeight: '60px' }}
                    alt={logo.name + '-logo'}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="w-1/2 h-full flex flex-col overflow-auto rounded-lg p-2"
          style={{ backgroundColor: 'rgba(225, 231, 239, 0.2)' }}>
          <h2 className="text-lg font-bold text-slate-700 mb-2">Regulation Compliance</h2>
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-slate-500">Loading regulations...</div>
              </div>
            ) : errorMsg ? (
              <div className="flex items-center justify-center h-full italic text-slate-500">
                {'<' + errorMsg + '>'}
              </div>
            ) : regulationRegions.length === 0 ? (
              <div className="flex items-center justify-center h-full italic text-slate-500">
                {selectedApis.size === 0 
                  ? '<Please select a supported API>'
                  : '<No regulations found for selected APIs. The selected APIs may not be supported by Certivity.>'}
              </div>
            ) : (
              <div className="space-y-7 mt-4">
                {regulationRegions.map((region) => (
                  <div key={region.name} className="space-y-2">
                    <p className="font-bold text-lg text-slate-700 mt-5 flex items-center justify-start gap-4">
                      {region.name} Region
                    </p>
                    <div className="border-t my-6 border-t-slate-300" />
                    <div>
                      {region.types.map((type) => (
                        <div key={type.name}>
                          <p className="font-bold mt-3 text-base text-slate-700">{type.name}</p>
                          <ul className="space-y-6 mt-4">
                            {type.regulations.map((regulation) => (
                              <li
                                key={regulation.key}
                                className="mt-3 list-disc ml-4 space-y-2"
                              >
                                <p className="text-sm font-bold text-slate-700">
                                  {regulation.key}: {regulation.titleShort}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {regulation.titleLong}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
