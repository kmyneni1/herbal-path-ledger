import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProvenanceTimeline } from "@/components/ProvenanceTimeline";
import { TraceabilityMap } from "@/components/TraceabilityMap";
import { Batch, CollectionEvent } from "@/types/blockchain";
import { BlockchainService } from "@/lib/blockchain";
import { 
  CheckCircle, 
  XCircle, 
  Leaf, 
  MapPin, 
  Calendar, 
  Weight, 
  Award,
  ArrowLeft,
  Shield,
  Heart
} from "lucide-react";

export default function VerifyBatch() {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (batchId) {
      const batchData = BlockchainService.getBatch(batchId);
      setBatch(batchData);
      
      if (batchData) {
        const verificationResult = BlockchainService.verifyBatch(batchId);
        setVerification(verificationResult);
      }
      
      setLoading(false);
    }
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying batch authenticity...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Batch Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The QR code you scanned does not correspond to a valid batch in our system.
            </p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const collectionEvents = batch.events.filter(e => 'gpsLocation' in e) as CollectionEvent[];
  const complianceReport = BlockchainService.generateComplianceReport(batch.id);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Product Verification</h1>
            <p className="text-muted-foreground">Blockchain-verified Ayurvedic herb traceability</p>
          </div>
        </div>

        {/* Verification Status */}
        <Card className="mb-6 border-2 border-primary/20 shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {verification?.valid ? (
                  <CheckCircle className="w-8 h-8 text-success" />
                ) : (
                  <XCircle className="w-8 h-8 text-destructive" />
                )}
                <div>
                  <h2 className="text-2xl font-bold">
                    {verification?.valid ? 'Verified Authentic' : 'Verification Issues'}
                  </h2>
                  <p className="text-muted-foreground">
                    Compliance Score: {verification?.complianceScore || 0}/100
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {complianceReport.ayushCompliance && (
                  <Badge variant="default" className="bg-success">
                    <Shield className="w-3 h-3 mr-1" />
                    AYUSH Certified
                  </Badge>
                )}
                {complianceReport.organicCertified && (
                  <Badge variant="secondary" className="bg-primary">
                    <Leaf className="w-3 h-3 mr-1" />
                    Organic
                  </Badge>
                )}
                {complianceReport.fairTrade && (
                  <Badge variant="outline" className="border-accent text-accent-foreground">
                    <Heart className="w-3 h-3 mr-1" />
                    Fair Trade
                  </Badge>
                )}
              </div>
            </div>

            {verification?.violations && verification.violations.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold text-destructive mb-2">Compliance Issues:</h3>
                <ul className="list-disc list-inside text-sm text-destructive space-y-1">
                  {verification.violations.map((violation: string, index: number) => (
                    <li key={index}>{violation}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Species</p>
                <p className="font-semibold">{batch.species.split('(')[0].trim()}</p>
                <p className="text-xs text-muted-foreground">{batch.species.split('(')[1]?.replace(')', '') || ''}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Harvest Date</p>
                <p className="font-semibold">{batch.harvestDate.toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Weight className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Batch Size</p>
                <p className="font-semibold">{batch.totalQuantity} {batch.unit}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className="capitalize">
                  {batch.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Harvest Locations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Harvest Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TraceabilityMap collectionEvents={collectionEvents} />
                <div className="mt-4 space-y-2">
                  {collectionEvents.map((event, index) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{event.locationName}</p>
                        <p className="text-sm text-muted-foreground">
                          GPS: {event.gpsLocation.latitude.toFixed(4)}, {event.gpsLocation.longitude.toFixed(4)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Collected by: {event.collectorName}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {event.timestamp.toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {batch.events
                    .filter(e => 'labId' in e)
                    .map((test: any) => (
                      <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{test.testType.replace('_', ' ')} Test</p>
                          <p className="text-sm text-muted-foreground">
                            {test.results.value} {test.results.unit} ({test.results.standard})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tested by: {test.labName}
                          </p>
                        </div>
                        <Badge variant={test.results.passed ? "default" : "destructive"}>
                          {test.results.passed ? "PASSED" : "FAILED"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supply Chain Timeline */}
          <ProvenanceTimeline events={batch.events} />
        </div>

        {/* Sustainability & Compliance */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sustainability & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-semibold">AYUSH Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  {complianceReport.ayushCompliance ? 'Fully Compliant' : 'Needs Review'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Organic Certified</h3>
                <p className="text-sm text-muted-foreground">
                  {complianceReport.organicCertified ? 'Certified Organic' : 'Not Certified'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold">Fair Trade</h3>
                <p className="text-sm text-muted-foreground">
                  {complianceReport.fairTrade ? 'Fair Trade Certified' : 'Not Certified'}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Sustainability Score: {complianceReport.sustainabilityScore}/100</h4>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${complianceReport.sustainabilityScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Based on geo-fencing compliance, quality tests, processing standards, and chain of custody verification.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 p-6 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Powered by blockchain technology for immutable traceability
          </p>
          <p className="text-xs text-muted-foreground">
            Batch ID: <code className="bg-muted px-1 rounded">{batch.id}</code> | 
            Verified on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}