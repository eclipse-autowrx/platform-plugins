// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;

// Simple requirement store using React hooks
let requirementsState: any[] = [];
let scanningState: boolean = false;
let selectedRequirementIdState: string | null = null;
const listeners: Set<Function> = new Set();

export const useRequirementStore = () => {
  const [requirements, setRequirements] = React.useState(requirementsState);
  const [isScanning, setIsScanning] = React.useState(scanningState);
  const [selectedRequirementId, setSelectedRequirementId] = React.useState(selectedRequirementIdState);

  React.useEffect(() => {
    const listener = () => {
      // Ensure requirementsState is always an array before spreading
      const newReqs = Array.isArray(requirementsState) ? requirementsState : [];
      setRequirements([...newReqs]);
      setIsScanning(scanningState);
      setSelectedRequirementId(selectedRequirementIdState);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setRequirementsGlobal = (reqs: any[] | ((prev: any[]) => any[])) => {
    // Support functional updates like React's setState
    if (typeof reqs === 'function') {
      requirementsState = reqs(requirementsState);
      console.log('📦 Store updated (functional):', requirementsState.length, 'requirements');
    } else {
      // Ensure we always set an array
      requirementsState = Array.isArray(reqs) ? reqs : [];
      console.log('📦 Store updated (direct):', requirementsState.length, 'requirements');
    }
    listeners.forEach(l => l());
    console.log('📢 Notified', listeners.size, 'listeners');
  };

  const startScanning = () => {
    scanningState = true;
    listeners.forEach(l => l());
  };

  const stopScanning = () => {
    scanningState = false;
    listeners.forEach(l => l());
  };

  const setSelectedRequirementIdGlobal = (id: string | null) => {
    selectedRequirementIdState = id;
    listeners.forEach(l => l());
  };

  return {
    requirements,
    isScanning,
    selectedRequirementId,
    setRequirements: setRequirementsGlobal,
    startScanning,
    stopScanning,
    setSelectedRequirementId: setSelectedRequirementIdGlobal,
  };
};

// Export for use in static context
export const getRequirementsState = () => requirementsState;
export const setRequirementsState = (reqs: any[] | ((prev: any[]) => any[])) => {
  // Support functional updates like React's setState
  if (typeof reqs === 'function') {
    requirementsState = reqs(requirementsState);
  } else {
    requirementsState = Array.isArray(reqs) ? reqs : [];
  }
  listeners.forEach(l => l());
};

// Add getState() method to useRequirementStore for compatibility with reference
(useRequirementStore as any).getState = () => ({
  requirements: requirementsState,
  isScanning: scanningState,
  selectedRequirementId: selectedRequirementIdState,
});

