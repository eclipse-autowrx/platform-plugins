// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import { ReactFlowProvider } from '@xyflow/react';
import { Requirement } from './types';
import DaRequirementExplorer from './DaRequirementExplorer';
import DaRequirementTable from './DaRequirementTable';
import { convertCustomerJourneyToRequirements, fetchRequirements } from './api';
import { useRequirementStore, setRequirementsState } from './useRequirementStore';
import './tailwind-utils.css';

type PageProps = { data?: any; config?: any };

const LOGOS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch-logo.svg/650px-Bosch-logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Logo_Aleph_Alpha.svg/900px-Logo_Aleph_Alpha.svg.png?20231109052320',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/768px-Microsoft_logo_%282012%29.svg.png?20230221160917',
];

export default function Page({ data, config }: PageProps) {
  const { model, prototype } = data || {};
  const [isEditing, setIsEditing] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const { requirements, setRequirements, startScanning, stopScanning } = useRequirementStore();

  React.useEffect(() => {
    console.log('Page loaded with data:', { data, config });

    // Extract requirements from prototype data
    if (prototype?.extend?.requirements && Array.isArray(prototype.extend.requirements)) {
      const reqs = prototype.extend.requirements.map((req: any) => ({
        id: req.id || crypto.randomUUID(),
        title: req.title || req.id || 'Untitled',
        description: req.description || '',
        type: req.type || 'Functional Requirement',
        source: req.source || { type: 'internal', link: '' },
        rating: {
          priority: req.rating?.priority || req.priority || 3,
          relevance: req.rating?.relevance || req.relevance || 3,
          impact: req.rating?.impact || req.impact || 3,
        },
        isHidden: false,
      }));
      setRequirements(reqs);
    }
  }, [data, prototype]);

  React.useEffect(() => {
    if (isScanning) {
      startScanning();
    } else {
      stopScanning();
    }
  }, [isScanning]);

  const showResultOneByOne = async (items: Requirement[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      console.warn('showResultOneByOne called with invalid items:', items);
      return;
    }

    // First, set all items and hide them all (let DaRequirementExplorer calculate positions)
    const itemsWithHidden = items.map((item) => ({
      ...item,
      isHidden: true,
    }));

    console.log('Setting all requirements as hidden first:', itemsWithHidden.length);
    // Set all items at once (all hidden) - DaRequirementExplorer will calculate positions
    setRequirements(itemsWithHidden);
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Create a random array of indices for the order of appearance
    const indices = Array.from({ length: items.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Now show them one by one by just toggling visibility
    for (let i = 0; i < indices.length; i++) {
      const currentItems = (useRequirementStore as any).getState().requirements;
      const updatedItems = currentItems.map(
        (item: Requirement, index: number) =>
          index === indices[i] ? { ...item, isHidden: false } : item,
      );
      console.log(`Revealing requirement ${i + 1}/${items.length}:`, updatedItems[indices[i]]?.title);
      setRequirements(updatedItems);
      await new Promise((resolve) =>
        setTimeout(resolve, Math.floor(Math.random() * (600 - 200 + 1)) + 200),
      );
    }
  };

  const scanRequirements = async () => {
    if (!prototype || !prototype.customer_journey) {
      alert('No customer journey found');
      return;
    }
    
    console.log('🔍 Starting requirement scan...');
    console.log('📋 Customer Journey:', prototype.customer_journey);
    
    setIsScanning(true);
    setRequirements([]);

    let requirementText: string = '';
    try {
      console.log('⚙️ Converting customer journey to requirements...');
      let processedReq = await convertCustomerJourneyToRequirements(
        prototype.customer_journey,
      );
      if (processedReq && typeof processedReq === 'string') {
        requirementText = processedReq;
        console.log('✅ Processed requirement text:', requirementText);
      }
    } catch (err) {
      console.error('❌ Failed to convert customer journey to requirements', err);
    }

    try {
      console.log('🔎 Fetching similar requirements from API...');
      let reqs = await fetchRequirements(requirementText, 2);
      
      console.log('📊 Scan Results:');
      console.log('   Total requirements found:', reqs?.length || 0);
      console.log('   Raw requirements data:', reqs);
      
      // Retry once if no requirements found
      if (reqs && Array.isArray(reqs) && reqs.length === 0) {
        console.warn('⚠️ No relevant requirements found, retrying...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        reqs = await fetchRequirements(requirementText, 2);
        console.log('📊 Retry Results:');
        console.log('   Total requirements found:', reqs?.length || 0);
        console.log('   Raw requirements data:', reqs);
      }
      
      if (reqs && Array.isArray(reqs) && reqs.length === 0) {
        console.warn('⚠️ No relevant requirements found after retry');
        setRequirements([]);
      } else if (reqs && Array.isArray(reqs)) {
        // Convert API format to internal format with proper type conversion
        const normalizedReqs = reqs.map((req: any) => ({
          id: req.id || req.documentId || crypto.randomUUID(),
          title: req.title || 'Untitled',
          description: req.description || '',
          type: req.type || 'Functional Requirement',
          source: req.source || { type: 'internal', link: '' },
          rating: {
            // Convert string ratings to numbers, handle "0" as valid value
            priority: parseInt(req.rating?.priority || '3', 10) || 3,
            relevance: parseInt(req.rating?.relevance || '3', 10) || 3,
            impact: parseInt(req.rating?.impact || '3', 10) || 3,
          },
          isHidden: false,
        }));
        
        console.log('✅ Normalized requirements:', normalizedReqs);
        console.log('✨ Displaying requirements one by one...');
        await showResultOneByOne(normalizedReqs);
        console.log('✅ All requirements displayed successfully');
      } else {
        console.error('❌ Invalid requirements data received');
        alert('Invalid requirements data received');
        setRequirements([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch requirements', error);
      alert('Failed to fetch requirements');
      setRequirements([]);
    } finally {
      setIsScanning(false);
      console.log('🏁 Scan completed');
    }
  };

  const handleDelete = (id: string) => {
    const updated = requirements.filter((r: Requirement) => r.id !== id);
    setRequirements(updated);
  };

  const handleEdit = (id: string) => {
    console.log('Edit requirement:', id);
  };

  return (
    <div
      className="flex w-full h-full flex-col bg-white rounded-md"
      style={{ padding: '1rem 2.5rem' }}
    >
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center border-b pb-2 mb-4">
          <div className="text-lg font-bold text-da-primary-500">
            Requirements: {prototype?.name}
          </div>
          <div className="grow" />
          <div className="flex items-center space-x-1">
            <button
              onClick={scanRequirements}
              disabled={isScanning}
              className="flex items-center border rounded-md px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
              style={{ backgroundColor: isScanning ? '#e5e7eb' : 'white' }}
            >
              {isScanning ? 'Is scanning' : 'Run new scan'}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center border rounded-md px-3 py-1 text-sm hover:bg-gray-100"
            >
              {isEditing ? 'Explorer View' : 'Table View'}
            </button>
          </div>
        </div>

        <div className="fixed right-2 z-[1000] rounded-2xl shadow-lg px-1 py-1 flex space-x-4 items-center" 
          style={{ background: 'rgba(255, 255, 255, 0.95)', zIndex: 1000, bottom: '20px' }}>
          {LOGOS.map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt={`logo-${idx}`}
              className="h-6 w-auto object-contain block"
            />
          ))}
        </div>

        <div className="flex w-full h-full">
          {isEditing ? (
            <div className="flex w-full h-full">
              <DaRequirementTable onDelete={handleDelete} onEdit={handleEdit} />
            </div>
          ) : (
            <ReactFlowProvider children={undefined}>
              <div className="flex w-full h-full">
                <DaRequirementExplorer onDelete={handleDelete} onEdit={handleEdit} />
              </div>
            </ReactFlowProvider>
          )}
        </div>
      </div>
    </div>
  );
}
