// Mock blockchain service for demonstration
import { Batch, CollectionEvent, ProcessingStep, QualityTest, Provenance, ComplianceReport } from '@/types/blockchain';

// In-memory storage (would be replaced with actual blockchain in production)
const batches = new Map<string, Batch>();
const events = new Map<string, (CollectionEvent | ProcessingStep | QualityTest | Provenance)[]>();

export class BlockchainService {
  // Generate a unique batch ID
  static generateBatchId(): string {
    return `ASH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a new batch
  static createBatch(species: string, harvestDate: Date, quantity: number): Batch {
    const id = this.generateBatchId();
    const batch: Batch = {
      id,
      species,
      harvestDate,
      totalQuantity: quantity,
      unit: 'kg',
      status: 'harvested',
      qrCode: `https://ayur-trace.com/verify/${id}`,
      events: []
    };
    
    batches.set(id, batch);
    events.set(id, []);
    
    console.log(`[BLOCKCHAIN] Created new batch: ${id}`);
    return batch;
  }

  // Add an event to the blockchain
  static addEvent(batchId: string, event: CollectionEvent | ProcessingStep | QualityTest | Provenance): boolean {
    const batch = batches.get(batchId);
    if (!batch) return false;

    const batchEvents = events.get(batchId) || [];
    batchEvents.push(event);
    events.set(batchId, batchEvents);

    // Update batch status based on event type
    if (event.id.includes('collection')) batch.status = 'harvested';
    if (event.id.includes('processing')) batch.status = 'processing';
    if (event.id.includes('quality')) batch.status = 'tested';
    if (event.id.includes('manufacturing')) batch.status = 'manufactured';

    batch.events = batchEvents;
    batches.set(batchId, batch);

    console.log(`[BLOCKCHAIN] Added event ${event.id} to batch ${batchId}`);
    return true;
  }

  // Get batch by ID
  static getBatch(batchId: string): Batch | null {
    return batches.get(batchId) || null;
  }

  // Get all batches
  static getAllBatches(): Batch[] {
    return Array.from(batches.values());
  }

  // Verify batch integrity (mock smart contract validation)
  static verifyBatch(batchId: string): {
    valid: boolean;
    violations: string[];
    complianceScore: number;
  } {
    const batch = batches.get(batchId);
    if (!batch) return { valid: false, violations: ['Batch not found'], complianceScore: 0 };

    const violations: string[] = [];
    let score = 100;

    // Check for collection event
    const hasCollection = batch.events.some(e => 'collectorId' in e);
    if (!hasCollection) {
      violations.push('Missing collection event');
      score -= 20;
    }

    // Check for quality testing
    const hasQualityTest = batch.events.some(e => 'labId' in e);
    if (!hasQualityTest) {
      violations.push('Missing quality test certification');
      score -= 15;
    }

    // Check GPS coordinates (geo-fencing)
    const collectionEvents = batch.events.filter(e => 'gpsLocation' in e) as CollectionEvent[];
    for (const event of collectionEvents) {
      // Mock approved zones (example: Kerala, India region)
      const approvedZones = [
        { name: 'Kerala Approved Zone', lat: 10.8505, lng: 76.2711, radius: 200000 }, // 200km radius
        { name: 'Karnataka Approved Zone', lat: 15.3173, lng: 75.7139, radius: 150000 }
      ];

      const isInApprovedZone = approvedZones.some(zone => {
        const distance = this.calculateDistance(
          event.gpsLocation.latitude,
          event.gpsLocation.longitude,
          zone.lat,
          zone.lng
        );
        return distance <= zone.radius;
      });

      if (!isInApprovedZone) {
        violations.push(`Collection location outside approved zones`);
        score -= 25;
      }
    }

    return {
      valid: violations.length === 0,
      violations,
      complianceScore: Math.max(0, score)
    };
  }

  // Generate compliance report
  static generateComplianceReport(batchId: string): ComplianceReport {
    const verification = this.verifyBatch(batchId);
    const batch = batches.get(batchId);
    
    return {
      batchId,
      generatedAt: new Date(),
      generatedBy: 'AYUSH Compliance System',
      ayushCompliance: verification.complianceScore >= 80,
      organicCertified: verification.complianceScore >= 90,
      fairTrade: verification.complianceScore >= 85,
      sustainabilityScore: verification.complianceScore,
      violations: verification.violations
    };
  }

  // Calculate distance between two GPS coordinates (in meters)
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Initialize demo data
  static initializeDemoData() {
    // Create sample Ashwagandha batch
    const batch = this.createBatch('Withania somnifera (Ashwagandha)', new Date('2024-01-15'), 150);
    
    // Add collection event
    const collectionEvent: CollectionEvent = {
      id: 'collection-001',
      timestamp: new Date('2024-01-15T06:30:00'),
      collectorId: 'farmer-001',
      collectorName: 'Rajesh Kumar',
      species: 'Withania somnifera',
      gpsLocation: { latitude: 10.8505, longitude: 76.2711 },
      locationName: 'Munnar, Kerala',
      qualityMetrics: {
        moisture: 12.5,
        appearance: 'Fresh, unblemished roots',
        aroma: 'Strong, characteristic'
      },
      photos: ['harvest-001.jpg'],
      batchId: batch.id
    };
    
    // Add processing step
    const processingEvent: ProcessingStep = {
      id: 'processing-001',
      timestamp: new Date('2024-01-16T10:00:00'),
      processorId: 'processor-001',
      processorName: 'Kerala Ayurveda Processing Co.',
      stepType: 'drying',
      temperature: 40,
      duration: 72, // hours
      batchId: batch.id,
      notes: 'Shade dried at controlled temperature'
    };

    // Add quality test
    const qualityEvent: QualityTest = {
      id: 'quality-001',
      timestamp: new Date('2024-01-18T14:00:00'),
      labId: 'lab-001',
      labName: 'AYUSH Certified Testing Lab',
      testType: 'moisture',
      results: {
        passed: true,
        value: 8.2,
        unit: '%',
        standard: 'AYUSH Guidelines ≤10%'
      },
      certificateUrl: 'cert-moisture-001.pdf',
      batchId: batch.id
    };

    this.addEvent(batch.id, collectionEvent);
    this.addEvent(batch.id, processingEvent);
    this.addEvent(batch.id, qualityEvent);
  }
}

// Initialize demo data on import
BlockchainService.initializeDemoData();