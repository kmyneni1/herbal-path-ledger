// Blockchain data types for the Ayurvedic herb traceability system

export interface CollectionEvent {
  id: string;
  timestamp: Date;
  collectorId: string;
  collectorName: string;
  species: string;
  gpsLocation: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  qualityMetrics: {
    moisture: number;
    appearance: string;
    aroma: string;
  };
  photos: string[];
  batchId: string;
}

export interface ProcessingStep {
  id: string;
  timestamp: Date;
  processorId: string;
  processorName: string;
  stepType: 'drying' | 'grinding' | 'storage' | 'packaging';
  temperature?: number;
  duration: number;
  batchId: string;
  notes: string;
}

export interface QualityTest {
  id: string;
  timestamp: Date;
  labId: string;
  labName: string;
  testType: 'moisture' | 'pesticide' | 'dna' | 'heavy_metals' | 'microbial';
  results: {
    passed: boolean;
    value: number;
    unit: string;
    standard: string;
  };
  certificateUrl?: string;
  batchId: string;
}

export interface Provenance {
  id: string;
  timestamp: Date;
  fromEntity: string;
  toEntity: string;
  entityType: 'farmer' | 'processor' | 'lab' | 'manufacturer' | 'retailer';
  batchId: string;
  quantity: number;
  unit: string;
  signature: string;
}

export interface Batch {
  id: string;
  species: string;
  harvestDate: Date;
  totalQuantity: number;
  unit: string;
  status: 'harvested' | 'processing' | 'tested' | 'manufactured' | 'packaged' | 'distributed';
  qrCode: string;
  events: (CollectionEvent | ProcessingStep | QualityTest | Provenance)[];
}

export interface ComplianceReport {
  batchId: string;
  generatedAt: Date;
  generatedBy: string;
  ayushCompliance: boolean;
  organicCertified: boolean;
  fairTrade: boolean;
  sustainabilityScore: number;
  violations: string[];
}

export type UserRole = 'farmer' | 'processor' | 'lab' | 'manufacturer' | 'regulator' | 'consumer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  organization: string;
  verified: boolean;
}