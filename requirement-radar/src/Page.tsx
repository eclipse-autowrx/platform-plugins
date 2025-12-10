// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import { ReactFlowProvider } from '@xyflow/react';
import { Requirement } from './types';
import DaRequirementExplorer from './DaRequirementExplorer';
import DaRequirementTable from './DaRequirementTable';
import RequirementPopup from './RequirementPopup';
import { convertCustomerJourneyToRequirements, fetchRequirements } from './api';
import { useRequirementStore, setRequirementsState } from './useRequirementStore';
import ShadowDomWrapper from './ShadowDomWrapper';

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
      // It's safer to get the latest state directly from the store inside the loop
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
          isHidden: true,
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
    <ShadowDomWrapper>
      <div
        className="req-radar-flex req-radar-w-full req-radar-h-full req-radar-flex-col req-radar-bg-white req-radar-rounded-md"
        style={{ minHeight: '500px', height: '100%' }}
      >
        <div className="req-radar-flex req-radar-flex-col req-radar-w-full req-radar-flex-1" style={{ minHeight: 0, padding: '8px' }}>
          <div className="req-radar-flex req-radar-items-center req-radar-border-b req-radar-pb-2 req-radar-mb-4">
            <div 
              className="req-radar-text-lg req-radar-font-bold req-radar-text-primary"
              style={{ color: 'var(--req-radar-primary, oklch(0.35 0.08 230))' }}
            >
              Requirements: {prototype?.name}
            </div>
            <div className="req-radar-grow" />
            <div className="req-radar-flex req-radar-items-center req-radar-space-x-1">
              <button
                onClick={scanRequirements}
                disabled={isScanning}
                className="req-radar-flex req-radar-items-center req-radar-px-3 req-radar-py-1 req-radar-text-sm req-radar-cursor-pointer req-radar-button-flat"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--req-radar-primary, oklch(0.35 0.08 230))',
                  border: 'none',
                  outline: 'none',
                  opacity: isScanning ? 0.5 : 1,
                  gap: '0.5rem',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--req-radar-primary, oklch(0.35 0.08 230))' }}>
                  <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M13 10l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {isScanning ? 'Is scanning' : 'Run new scan'}
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="req-radar-flex req-radar-items-center req-radar-px-3 req-radar-py-1 req-radar-text-sm req-radar-cursor-pointer req-radar-button-flat"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--req-radar-primary, oklch(0.35 0.08 230))',
                  border: 'none',
                  outline: 'none',
                  gap: '0.5rem',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--req-radar-primary, oklch(0.35 0.08 230))' }}>
                  <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                </svg>
                {isEditing ? 'Explorer View' : 'Table View'}
              </button>
            </div>
          </div>

          <div
            className="req-radar-fixed req-radar-right-2 req-radar-z-1000 req-radar-rounded-2xl req-radar-shadow-lg req-radar-px-1 req-radar-py-1 req-radar-flex req-radar-space-x-4 req-radar-items-center"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              zIndex: 1000,
              bottom: '20px',
            }}
          >
            {LOGOS.map((logo, idx) =>
              React.createElement('img', {
                key: `logo-${idx}`,
                src: logo,
                alt: `Logo ${idx + 1}`,
                className:
                  'req-radar-h-6 req-radar-w-auto req-radar-object-contain req-radar-block',
              })
            )}
          </div>

          <div
            className="req-radar-flex req-radar-w-full req-radar-flex-1"
            style={{ minHeight: 0, height: '100%' }}
          >
            {isEditing ? (
              <div className="req-radar-flex req-radar-w-full req-radar-h-full">
                <DaRequirementTable onDelete={handleDelete} onEdit={handleEdit} />
              </div>
            ) : (
              <ReactFlowProvider>
                <div
                  className="req-radar-flex req-radar-w-full req-radar-h-full"
                  style={{ minHeight: 0 }}
                >
                  <DaRequirementExplorer
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              </ReactFlowProvider>
            )}
          </div>
        </div>
        
        {/* Requirement Popup - Rendered outside ReactFlow */}
        <RequirementPopup onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </ShadowDomWrapper>
  );
}
