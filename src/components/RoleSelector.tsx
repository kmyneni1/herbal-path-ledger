import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/blockchain";
import { Leaf, FlaskConical, Factory, Shield, Users, Scan } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
  selectedRole?: UserRole;
}

const roles = [
  {
    role: 'farmer' as UserRole,
    title: 'Farmer/Collector',
    description: 'Record harvest data with GPS location and quality metrics',
    icon: Leaf,
    color: 'bg-primary',
  },
  {
    role: 'processor' as UserRole,
    title: 'Processor',
    description: 'Log processing steps like drying, grinding, and storage',
    icon: Factory,
    color: 'bg-accent',
  },
  {
    role: 'lab' as UserRole,
    title: 'Testing Lab',
    description: 'Submit quality test results and certifications',
    icon: FlaskConical,
    color: 'bg-success',
  },
  {
    role: 'manufacturer' as UserRole,
    title: 'Manufacturer',
    description: 'Generate QR codes and manage final packaging',
    icon: Users,
    color: 'bg-warning',
  },
  {
    role: 'regulator' as UserRole,
    title: 'Regulator',
    description: 'Monitor compliance and generate audit reports',
    icon: Shield,
    color: 'bg-destructive',
  },
  {
    role: 'consumer' as UserRole,
    title: 'Consumer',
    description: 'Scan QR codes to verify product authenticity',
    icon: Scan,
    color: 'bg-muted',
  },
];

export function RoleSelector({ onRoleSelect, selectedRole }: RoleSelectorProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
          Ayurvedic Herb Traceability Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Blockchain-powered supply chain transparency from harvest to consumer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {roles.map(({ role, title, description, icon: Icon, color }) => (
          <Card 
            key={role} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-strong border-2 ${
              selectedRole === role ? 'border-primary shadow-glow' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onRoleSelect(role)}
          >
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant={selectedRole === role ? "default" : "outline"} 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onRoleSelect(role);
                }}
              >
                {selectedRole === role ? 'Selected' : 'Select Role'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}