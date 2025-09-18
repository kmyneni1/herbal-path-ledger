import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Leaf, Heart, Brain, Shield, AlertTriangle } from "lucide-react";

interface HerbInfoProps {
  species: string;
  isOpen: boolean;
  onClose: () => void;
}

const herbDatabase = {
  "Withania somnifera (Ashwagandha)": {
    commonName: "Ashwagandha",
    scientificName: "Withania somnifera",
    family: "Solanaceae",
    description: "Ashwagandha is a powerful adaptogenic herb that has been used in Ayurvedic medicine for over 3,000 years. Known as 'Indian Winter Cherry', it helps the body manage stress and promotes overall vitality.",
    medicinalUses: [
      "Stress and anxiety reduction",
      "Improved sleep quality", 
      "Enhanced cognitive function",
      "Boosted immune system",
      "Increased muscle mass and strength",
      "Blood sugar regulation",
      "Thyroid function support",
      "Anti-inflammatory effects"
    ],
    therapeuticProperties: [
      "Adaptogenic",
      "Anxiolytic", 
      "Anti-inflammatory",
      "Immunomodulatory",
      "Neuroprotective",
      "Antioxidant"
    ],
    dosage: "300-500mg standardized extract twice daily, or 1-6g of root powder daily",
    contraindications: [
      "Pregnancy and breastfeeding",
      "Autoimmune diseases (lupus, multiple sclerosis, rheumatoid arthritis)",
      "Medications for diabetes, blood pressure, or immunosuppressants",
      "Surgery (discontinue 2 weeks prior)"
    ],
    sideEffects: "Generally well-tolerated. May cause drowsiness, stomach upset, or diarrhea in some individuals.",
    ayurvedicClassification: {
      rasa: "Kashaya (Astringent), Madhura (Sweet), Tikta (Bitter)",
      virya: "Ushna (Hot)",
      vipaka: "Madhura (Sweet)",
      dosha: "Balances Vata and Kapha, may increase Pitta in excess"
    }
  },
  "Curcuma longa (Turmeric)": {
    commonName: "Turmeric",
    scientificName: "Curcuma longa",
    family: "Zingiberaceae",
    description: "Turmeric is a golden-colored spice containing curcumin, renowned for its powerful anti-inflammatory and antioxidant properties. It's been used in Ayurveda for thousands of years.",
    medicinalUses: [
      "Anti-inflammatory support",
      "Joint health and arthritis relief",
      "Digestive health improvement",
      "Liver detoxification",
      "Cardiovascular health",
      "Brain health and memory",
      "Wound healing",
      "Skin health"
    ],
    therapeuticProperties: [
      "Anti-inflammatory",
      "Antioxidant",
      "Hepatoprotective",
      "Antimicrobial",
      "Cardioprotective",
      "Neuroprotective"
    ],
    dosage: "500-1000mg curcumin extract daily, or 1-3g turmeric powder with black pepper",
    contraindications: [
      "Gallstones or bile duct obstruction",
      "Blood thinning medications",
      "Surgery (discontinue 2 weeks prior)",
      "Iron deficiency (may reduce iron absorption)"
    ],
    sideEffects: "Generally safe. High doses may cause stomach irritation, nausea, or increased bleeding risk.",
    ayurvedicClassification: {
      rasa: "Tikta (Bitter), Katu (Pungent)",
      virya: "Ushna (Hot)",
      vipaka: "Katu (Pungent)",
      dosha: "Balances all three doshas, particularly Kapha and Vata"
    }
  },
  "Ocimum sanctum (Holy Basil)": {
    commonName: "Holy Basil (Tulsi)",
    scientificName: "Ocimum sanctum",
    family: "Lamiaceae",
    description: "Holy Basil, or Tulsi, is considered sacred in Hindu tradition and is one of the most revered herbs in Ayurveda. It's known for its adaptogenic and respiratory benefits.",
    medicinalUses: [
      "Respiratory health support",
      "Stress and anxiety relief",
      "Immune system enhancement",
      "Blood sugar regulation",
      "Heart health support",
      "Digestive aid",
      "Skin health",
      "Fever reduction"
    ],
    therapeuticProperties: [
      "Adaptogenic",
      "Expectorant",
      "Immunomodulatory",
      "Antimicrobial",
      "Antioxidant",
      "Anti-inflammatory"
    ],
    dosage: "300-600mg standardized extract daily, or 1-2 cups of fresh leaf tea",
    contraindications: [
      "Blood thinning medications",
      "Diabetes medications (monitor blood sugar)",
      "Pregnancy (in medicinal doses)",
      "Surgery (discontinue 2 weeks prior)"
    ],
    sideEffects: "Generally safe. May cause mild stomach upset or interact with certain medications.",
    ayurvedicClassification: {
      rasa: "Katu (Pungent), Tikta (Bitter)",
      virya: "Ushna (Hot)",
      vipaka: "Katu (Pungent)",
      dosha: "Balances Kapha and Vata, may increase Pitta in excess"
    }
  }
};

export function HerbInfo({ species, isOpen, onClose }: HerbInfoProps) {
  const herb = herbDatabase[species as keyof typeof herbDatabase];

  if (!herb) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Herb Information</DialogTitle>
            <DialogDescription>
              Information not available for {species}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-herb" />
            <DialogTitle className="text-2xl">{herb.commonName}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            <em>{herb.scientificName}</em> • Family: {herb.family}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{herb.description}</p>
            </CardContent>
          </Card>

          {/* Medicinal Uses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5 text-healing" />
                Medicinal Uses & Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {herb.medicinalUses.map((use, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-healing rounded-full flex-shrink-0" />
                    <span className="text-sm">{use}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Therapeutic Properties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-primary" />
                Therapeutic Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {herb.therapeuticProperties.map((property) => (
                  <Badge key={property} variant="secondary" className="text-xs">
                    {property}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ayurvedic Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ayurvedic Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Rasa (Taste)</Label>
                  <p className="text-sm text-muted-foreground">{herb.ayurvedicClassification.rasa}</p>
                </div>
                <div>
                  <Label className="font-medium">Virya (Potency)</Label>
                  <p className="text-sm text-muted-foreground">{herb.ayurvedicClassification.virya}</p>
                </div>
                <div>
                  <Label className="font-medium">Vipaka (Post-digestive effect)</Label>
                  <p className="text-sm text-muted-foreground">{herb.ayurvedicClassification.vipaka}</p>
                </div>
                <div>
                  <Label className="font-medium">Dosha Effect</Label>
                  <p className="text-sm text-muted-foreground">{herb.ayurvedicClassification.dosha}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dosage */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Dosage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-herb">{herb.dosage}</p>
              <p className="text-xs text-muted-foreground mt-2">
                *Consult with a qualified Ayurvedic practitioner or healthcare provider before use.
              </p>
            </CardContent>
          </Card>

          {/* Contraindications & Side Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-warning">
                <AlertTriangle className="w-5 h-5" />
                Important Safety Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Contraindications</h4>
                <ul className="space-y-1">
                  {herb.contraindications.map((contraindication, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-warning mt-1">•</span>
                      {contraindication}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-sm mb-2">Possible Side Effects</h4>
                <p className="text-sm text-muted-foreground">{herb.sideEffects}</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> This information is for educational purposes only and is not intended to replace professional medical advice. Always consult with a qualified healthcare provider or Ayurvedic practitioner before using any herbal remedy.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}