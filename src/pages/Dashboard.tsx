import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { RoleSelector } from "@/components/RoleSelector";
import { ProvenanceTimeline } from "@/components/ProvenanceTimeline";
import { TraceabilityMap } from "@/components/TraceabilityMap";
import { QRGenerator } from "@/components/QRGenerator";

import { UserRole, Batch, CollectionEvent, ProcessingStep, QualityTest, Provenance } from "@/types/blockchain";
import { BlockchainService } from "@/lib/blockchain";
import { ArrowLeft, Plus, Search, FileText, MapPin, Clock, QrCode } from "lucide-react";

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Form states
  const [collectionForm, setCollectionForm] = useState({
    collectorName: '',
    species: 'Withania somnifera (Ashwagandha)',
    latitude: '',
    longitude: '',
    locationName: '',
    moisture: '',
    appearance: '',
    aroma: '',
    quantity: ''
  });

  const [processingForm, setProcessingForm] = useState({
    processorName: '',
    stepType: 'drying' as 'drying' | 'grinding' | 'storage' | 'packaging',
    temperature: '',
    duration: '',
    notes: ''
  });

  const [qualityForm, setQualityForm] = useState({
    labName: '',
    testType: 'moisture' as 'moisture' | 'pesticide' | 'dna' | 'heavy_metals' | 'microbial',
    value: '',
    unit: '%',
    standard: 'AYUSH Guidelines ≤10%',
    passed: true
  });

  useEffect(() => {
    setBatches(BlockchainService.getAllBatches());
  }, []);

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setSelectedBatch(null);
    setActiveTab("overview");
  };

  const handleCreateBatch = () => {
    if (!collectionForm.collectorName || !collectionForm.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const batch = BlockchainService.createBatch(
      collectionForm.species,
      new Date(),
      parseFloat(collectionForm.quantity)
    );

    const collectionEvent: CollectionEvent = {
      id: `collection-${Date.now()}`,
      timestamp: new Date(),
      collectorId: `farmer-${Date.now()}`,
      collectorName: collectionForm.collectorName,
      species: collectionForm.species,
      gpsLocation: {
        latitude: parseFloat(collectionForm.latitude) || 10.8505,
        longitude: parseFloat(collectionForm.longitude) || 76.2711
      },
      locationName: collectionForm.locationName || 'Kerala, India',
      qualityMetrics: {
        moisture: parseFloat(collectionForm.moisture) || 12.0,
        appearance: collectionForm.appearance || 'Good quality',
        aroma: collectionForm.aroma || 'Normal'
      },
      photos: [],
      batchId: batch.id
    };

    BlockchainService.addEvent(batch.id, collectionEvent);
    setBatches(BlockchainService.getAllBatches());
    toast.success("New batch created successfully!");
    
    // Reset form
    setCollectionForm({
      collectorName: '',
      species: 'Withania somnifera (Ashwagandha)',
      latitude: '',
      longitude: '',
      locationName: '',
      moisture: '',
      appearance: '',
      aroma: '',
      quantity: ''
    });
  };

  const handleAddProcessingStep = () => {
    if (!selectedBatch || !processingForm.processorName) {
      toast.error("Please select a batch and fill required fields");
      return;
    }

    const processingEvent: ProcessingStep = {
      id: `processing-${Date.now()}`,
      timestamp: new Date(),
      processorId: `processor-${Date.now()}`,
      processorName: processingForm.processorName,
      stepType: processingForm.stepType,
      temperature: parseFloat(processingForm.temperature) || undefined,
      duration: parseFloat(processingForm.duration) || 24,
      batchId: selectedBatch.id,
      notes: processingForm.notes || 'Processing completed'
    };

    BlockchainService.addEvent(selectedBatch.id, processingEvent);
    setBatches(BlockchainService.getAllBatches());
    setSelectedBatch(BlockchainService.getBatch(selectedBatch.id));
    toast.success("Processing step added successfully!");
    
    // Reset form
    setProcessingForm({
      processorName: '',
      stepType: 'drying',
      temperature: '',
      duration: '',
      notes: ''
    });
  };

  const handleAddQualityTest = () => {
    if (!selectedBatch || !qualityForm.labName) {
      toast.error("Please select a batch and fill required fields");
      return;
    }

    const qualityEvent: QualityTest = {
      id: `quality-${Date.now()}`,
      timestamp: new Date(),
      labId: `lab-${Date.now()}`,
      labName: qualityForm.labName,
      testType: qualityForm.testType,
      results: {
        passed: qualityForm.passed,
        value: parseFloat(qualityForm.value) || 0,
        unit: qualityForm.unit,
        standard: qualityForm.standard
      },
      batchId: selectedBatch.id
    };

    BlockchainService.addEvent(selectedBatch.id, qualityEvent);
    setBatches(BlockchainService.getAllBatches());
    setSelectedBatch(BlockchainService.getBatch(selectedBatch.id));
    toast.success("Quality test result added successfully!");
    
    // Reset form
    setQualityForm({
      labName: '',
      testType: 'moisture',
      value: '',
      unit: '%',
      standard: 'AYUSH Guidelines ≤10%',
      passed: true
    });
  };

  const generateComplianceReport = () => {
    if (!selectedBatch) return;
    
    const report = BlockchainService.generateComplianceReport(selectedBatch.id);
    toast.success("Compliance report generated!");
    console.log("Compliance Report:", report);
    
    // In a real app, this would download a PDF
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${selectedBatch.id}.json`;
    a.click();
  };

  if (!selectedRole) {
    return <RoleSelector onRoleSelect={setSelectedRole} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToRoles}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roles
          </Button>
          <div>
            <h1 className="text-2xl font-bold capitalize">{selectedRole} Dashboard</h1>
            <p className="text-muted-foreground">
              Ayurvedic Herb Traceability Platform
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="batch">Batch Details</TabsTrigger>
            <TabsTrigger value="qr">QR Codes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Batches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{batches.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Batches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {batches.filter(b => b.status !== 'distributed').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compliance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">98%</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Batches */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Batches</CardTitle>
                <CardDescription>Latest herb batches in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {batches.slice(-5).map((batch) => (
                    <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{batch.species}</p>
                        <p className="text-sm text-muted-foreground">
                          Batch ID: {batch.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {batch.totalQuantity} {batch.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {batch.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBatch(batch);
                            setActiveTab("batch");
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            {selectedRole === 'farmer' && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Batch</CardTitle>
                  <CardDescription>Record a new harvest with collection details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="collectorName">Collector Name *</Label>
                      <Input
                        id="collectorName"
                        value={collectionForm.collectorName}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, collectorName: e.target.value }))}
                        placeholder="Enter collector name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="species">Species</Label>
                      <Select value={collectionForm.species} onValueChange={(value) => setCollectionForm(prev => ({ ...prev, species: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Withania somnifera (Ashwagandha)">Withania somnifera (Ashwagandha)</SelectItem>
                          <SelectItem value="Curcuma longa (Turmeric)">Curcuma longa (Turmeric)</SelectItem>
                          <SelectItem value="Ocimum sanctum (Holy Basil)">Ocimum sanctum (Holy Basil)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={collectionForm.latitude}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, latitude: e.target.value }))}
                        placeholder="10.8505"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={collectionForm.longitude}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, longitude: e.target.value }))}
                        placeholder="76.2711"
                      />
                    </div>
                    <div>
                      <Label htmlFor="locationName">Location Name</Label>
                      <Input
                        id="locationName"
                        value={collectionForm.locationName}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, locationName: e.target.value }))}
                        placeholder="Munnar, Kerala"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity (kg) *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={collectionForm.quantity}
                        onChange={(e) => setCollectionForm(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="150"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateBatch} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Batch
                  </Button>
                </CardContent>
              </Card>
            )}

            {selectedRole === 'processor' && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Processing Step</CardTitle>
                  <CardDescription>Record processing activities for a batch</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Batch</Label>
                    <Select onValueChange={(value) => setSelectedBatch(batches.find(b => b.id === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a batch to process" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.species} - {batch.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="processorName">Processor Name *</Label>
                      <Input
                        id="processorName"
                        value={processingForm.processorName}
                        onChange={(e) => setProcessingForm(prev => ({ ...prev, processorName: e.target.value }))}
                        placeholder="Processing Company Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stepType">Processing Step</Label>
                      <Select value={processingForm.stepType} onValueChange={(value: any) => setProcessingForm(prev => ({ ...prev, stepType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drying">Drying</SelectItem>
                          <SelectItem value="grinding">Grinding</SelectItem>
                          <SelectItem value="storage">Storage</SelectItem>
                          <SelectItem value="packaging">Packaging</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        value={processingForm.temperature}
                        onChange={(e) => setProcessingForm(prev => ({ ...prev, temperature: e.target.value }))}
                        placeholder="40"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (hours) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={processingForm.duration}
                        onChange={(e) => setProcessingForm(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="72"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Processing Notes</Label>
                    <Textarea
                      id="notes"
                      value={processingForm.notes}
                      onChange={(e) => setProcessingForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional processing details..."
                    />
                  </div>
                  
                  <Button onClick={handleAddProcessingStep} className="w-full" disabled={!selectedBatch}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Processing Step
                  </Button>
                </CardContent>
              </Card>
            )}

            {selectedRole === 'lab' && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Quality Test Result</CardTitle>
                  <CardDescription>Submit laboratory test results for certification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Batch</Label>
                    <Select onValueChange={(value) => setSelectedBatch(batches.find(b => b.id === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a batch to test" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.species} - {batch.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="labName">Laboratory Name *</Label>
                      <Input
                        id="labName"
                        value={qualityForm.labName}
                        onChange={(e) => setQualityForm(prev => ({ ...prev, labName: e.target.value }))}
                        placeholder="AYUSH Certified Testing Lab"
                      />
                    </div>
                    <div>
                      <Label htmlFor="testType">Test Type</Label>
                      <Select value={qualityForm.testType} onValueChange={(value: any) => setQualityForm(prev => ({ ...prev, testType: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="moisture">Moisture Content</SelectItem>
                          <SelectItem value="pesticide">Pesticide Residue</SelectItem>
                          <SelectItem value="dna">DNA Authentication</SelectItem>
                          <SelectItem value="heavy_metals">Heavy Metals</SelectItem>
                          <SelectItem value="microbial">Microbial Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="testValue">Test Value *</Label>
                      <Input
                        id="testValue"
                        type="number"
                        step="0.1"
                        value={qualityForm.value}
                        onChange={(e) => setQualityForm(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="8.2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Input
                        id="unit"
                        value={qualityForm.unit}
                        onChange={(e) => setQualityForm(prev => ({ ...prev, unit: e.target.value }))}
                        placeholder="%"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="standard">Quality Standard</Label>
                    <Input
                      id="standard"
                      value={qualityForm.standard}
                      onChange={(e) => setQualityForm(prev => ({ ...prev, standard: e.target.value }))}
                      placeholder="AYUSH Guidelines ≤10%"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="passed"
                      checked={qualityForm.passed}
                      onChange={(e) => setQualityForm(prev => ({ ...prev, passed: e.target.checked }))}
                    />
                    <Label htmlFor="passed">Test Passed</Label>
                  </div>
                  
                  <Button onClick={handleAddQualityTest} className="w-full" disabled={!selectedBatch}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Test Result
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Batch Details Tab */}
          <TabsContent value="batch" className="space-y-6">
            {selectedBatch ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Batch Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Batch Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Batch ID</Label>
                          <code className="block text-sm bg-muted p-2 rounded">{selectedBatch.id}</code>
                        </div>
                        <div>
                          <Label>Species</Label>
                          <p className="text-sm font-medium">{selectedBatch.species}</p>
                        </div>
                        <div>
                          <Label>Harvest Date</Label>
                          <p className="text-sm">{selectedBatch.harvestDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <p className="text-sm">{selectedBatch.totalQuantity} {selectedBatch.unit}</p>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Badge variant="outline" className="capitalize">{selectedBatch.status}</Badge>
                        </div>
                        <div>
                          <Label>Events</Label>
                          <p className="text-sm">{selectedBatch.events.length} recorded</p>
                        </div>
                      </div>
                      
                      {selectedRole === 'regulator' && (
                        <Button onClick={generateComplianceReport} className="w-full mt-4">
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Compliance Report
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Map */}
                  <TraceabilityMap 
                    collectionEvents={selectedBatch.events.filter(e => 'gpsLocation' in e) as CollectionEvent[]}
                  />
                </div>

                {/* Timeline */}
                <ProvenanceTimeline events={selectedBatch.events} />
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Select a batch to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* QR Codes Tab */}
          <TabsContent value="qr" className="space-y-6">
            {selectedRole === 'manufacturer' || selectedRole === 'regulator' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {batches.map((batch) => (
                  <QRGenerator
                    key={batch.id}
                    batch={batch}
                    onPreview={() => {
                      window.open(`/verify/${batch.id}`, '_blank');
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <QrCode className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">QR code generation is available for manufacturers and regulators</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}