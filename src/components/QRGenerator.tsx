import React from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, QrCode } from "lucide-react";
import { Batch } from "@/types/blockchain";

interface QRGeneratorProps {
  batch: Batch;
  onPreview: () => void;
  className?: string;
}

export function QRGenerator({ batch, onPreview, className = "" }: QRGeneratorProps) {
  const qrValue = `https://ayur-trace.com/verify/${batch.id}`;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${batch.id}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr-${batch.id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Batch QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Batch Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Batch ID:</span>
            <code className="text-sm bg-muted px-2 py-1 rounded">{batch.id}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Species:</span>
            <span className="text-sm text-muted-foreground">{batch.species}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge 
              variant={
                batch.status === 'distributed' ? 'default' :
                batch.status === 'packaged' ? 'secondary' :
                batch.status === 'tested' ? 'outline' : 'destructive'
              }
              className="capitalize"
            >
              {batch.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quantity:</span>
            <span className="text-sm text-muted-foreground">{batch.totalQuantity} {batch.unit}</span>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg border">
          <QRCode
            id={`qr-${batch.id}`}
            value={qrValue}
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 200 200`}
          />
          <p className="text-xs text-muted-foreground text-center break-all max-w-full">
            {qrValue}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={downloadQR} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download QR
          </Button>
          <Button onClick={onPreview} variant="default" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            Preview Portal
          </Button>
        </div>

        {/* Usage Instructions */}
        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-md">
          <p className="font-medium">Usage Instructions:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Print this QR code on product packaging</li>
            <li>Consumers can scan to view full provenance</li>
            <li>No app download required - works in any camera app</li>
            <li>Links to public verification portal</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}