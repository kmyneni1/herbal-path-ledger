import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRScanner } from "@/components/QRScanner";
import { 
  Leaf, 
  Shield, 
  Scan, 
  Users, 
  CheckCircle, 
  MapPin, 
  Award,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleQRScan = (result: string) => {
    // Extract batch ID from QR result
    const batchIdMatch = result.match(/\/verify\/(.+)$/);
    if (batchIdMatch) {
      navigate(`/verify/${batchIdMatch[1]}`);
    } else {
      // Try to use the result directly as batch ID
      navigate(`/verify/${result}`);
    }
    setShowScanner(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium mb-6">
              <Shield className="w-4 h-4" />
              Blockchain-Powered Traceability
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Ayurvedic Herb
              </span>
              <br />
              Supply Chain Transparency
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Track your Ayurvedic herbs from geo-tagged harvest to your hands. 
              Immutable blockchain records ensure authenticity, quality, and compliance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => setShowScanner(true)}
            >
              <Scan className="w-5 h-5 mr-2" />
              Scan QR Code
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              asChild
            >
              <Link to="/dashboard">
                <Users className="w-5 h-5 mr-2" />
                Access Dashboard
              </Link>
            </Button>
          </div>

          {/* QR Scanner Modal */}
          {showScanner && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
              <QRScanner 
                onScan={handleQRScan}
                onClose={() => setShowScanner(false)}
              />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Complete Supply Chain Visibility</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides end-to-end traceability for Ayurvedic herbs, 
              ensuring quality, authenticity, and regulatory compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Geo-Tagged Harvesting */}
            <Card className="border-2 border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Geo-Tagged Harvesting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Record exact GPS locations, collector details, and quality metrics 
                  at the point of harvest with offline-capable mobile interface.
                </p>
              </CardContent>
            </Card>

            {/* Quality Certification */}
            <Card className="border-2 border-success/10 hover:border-success/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-xl">Lab Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Immutable lab test results for moisture, pesticides, DNA authentication, 
                  and heavy metals with AYUSH compliance verification.
                </p>
              </CardContent>
            </Card>

            {/* Blockchain Security */}
            <Card className="border-2 border-accent/10 hover:border-accent/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hyperledger Fabric-based immutable ledger with smart contracts 
                  enforcing geo-fencing and quality thresholds.
                </p>
              </CardContent>
            </Card>

            {/* Processing Transparency */}
            <Card className="border-2 border-warning/10 hover:border-warning/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-warning" />
                </div>
                <CardTitle className="text-xl">Processing Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Track every processing step including drying, grinding, and storage 
                  with temperature monitoring and quality control.
                </p>
              </CardContent>
            </Card>

            {/* Consumer Verification */}
            <Card className="border-2 border-destructive/10 hover:border-destructive/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                  <Scan className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-xl">QR Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Instant consumer verification through QR codes linking to 
                  complete provenance timelines and sustainability badges.
                </p>
              </CardContent>
            </Card>

            {/* Compliance Reporting */}
            <Card className="border-2 border-muted/10 hover:border-muted/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-muted/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">Compliance Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Automated compliance reports for AYUSH guidelines, organic certification, 
                  and export requirements with audit trail generation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Supply Chain?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the future of Ayurvedic herb traceability with blockchain-powered transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              asChild
            >
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => setShowScanner(true)}
            >
              <Scan className="w-5 h-5 mr-2" />
              Try Demo Scan
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">AyurTrace</span>
          </div>
          <p className="text-muted-foreground">
            Blockchain-powered Ayurvedic herb traceability platform
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Built for SIH 2025 - Ensuring authenticity, quality, and compliance
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
