import React, { useState } from 'react';
import Navbar from './components/Navbar';
import IngestModal from './components/IngestModal';
import Home from './pages/Home';
import Salaries from './pages/Salaries';
import Company from './pages/Company';
import Compare from './pages/Compare';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [compareIds, setCompareIds] = useState({ id1: '', id2: '' });
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  
  // Dynamic refresh key for child pages when new salaries are ingested
  const [refreshKey, setRefreshKey] = useState(0);

  const handleIngestSuccess = () => {
    // Increment refresh key to trigger state re-fetch on parent layouts
    setRefreshKey(prev => prev + 1);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            key={`home-${refreshKey}`}
            setActivePage={setActivePage}
            setSelectedCompany={setSelectedCompany}
            onOpenIngest={() => setIsIngestOpen(true)}
          />
        );
      case 'salaries':
        return (
          <Salaries
            key={`salaries-${refreshKey}`}
            setActivePage={setActivePage}
            setSelectedCompany={setSelectedCompany}
            setCompareIds={setCompareIds}
          />
        );
      case 'company':
        return (
          <Company
            key={`company-${selectedCompany}-${refreshKey}`}
            companyName={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            setActivePage={setActivePage}
          />
        );
      case 'compare':
        return (
          <Compare
            key={`compare-${compareIds.id1}-${compareIds.id2}-${refreshKey}`}
            compareIds={compareIds}
            setCompareIds={setCompareIds}
          />
        );
      default:
        return (
          <Home
            setActivePage={setActivePage}
            setSelectedCompany={setSelectedCompany}
            onOpenIngest={() => setIsIngestOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navigation Header */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenIngest={() => setIsIngestOpen(true)} 
      />

      {/* Main Content Pane */}
      <main className="flex-grow pb-16">
        {renderActivePage()}
      </main>

      {/* Footer bar */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950 text-center text-xs font-semibold text-slate-600 tracking-wider uppercase select-none">
        © {new Date().getFullYear()} Compensation Intelligence System • Inspired by Levels.fyi
      </footer>

      {/* Ingestion overlay modal */}
      <IngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onSuccess={handleIngestSuccess}
      />
    </div>
  );
}
