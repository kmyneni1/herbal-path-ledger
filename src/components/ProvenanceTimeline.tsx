import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollectionEvent, ProcessingStep, QualityTest, Provenance } from "@/types/blockchain";
import { CheckCircle, Clock, MapPin, Factory, FlaskConical, Users } from "lucide-react";

interface ProvenanceTimelineProps {
  events: (CollectionEvent | ProcessingStep | QualityTest | Provenance)[];
  className?: string;
}

export function ProvenanceTimeline({ events, className = "" }: ProvenanceTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getEventIcon = (event: any) => {
    if ('collectorId' in event) return MapPin;
    if ('processorId' in event) return Factory;
    if ('labId' in event) return FlaskConical;
    if ('fromEntity' in event) return Users;
    return Clock;
  };

  const getEventColor = (event: any) => {
    if ('collectorId' in event) return 'bg-primary';
    if ('processorId' in event) return 'bg-accent';
    if ('labId' in event) return 'bg-success';
    if ('fromEntity' in event) return 'bg-warning';
    return 'bg-muted';
  };

  const getEventTitle = (event: any) => {
    if ('collectorId' in event) return `Harvested by ${event.collectorName}`;
    if ('processorId' in event) return `${event.stepType} by ${event.processorName}`;
    if ('labId' in event) return `${event.testType} test by ${event.labName}`;
    if ('fromEntity' in event) return `Transfer: ${event.fromEntity} → ${event.toEntity}`;
    return 'Unknown Event';
  };

  const getEventDetails = (event: any) => {
    if ('collectorId' in event) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Location: {event.locationName}
          </p>
          <p className="text-sm text-muted-foreground">
            GPS: {event.gpsLocation.latitude.toFixed(4)}, {event.gpsLocation.longitude.toFixed(4)}
          </p>
          <p className="text-sm text-muted-foreground">
            Quality: {event.qualityMetrics.appearance}
          </p>
          <p className="text-sm text-muted-foreground">
            Moisture: {event.qualityMetrics.moisture}%
          </p>
        </div>
      );
    }

    if ('processorId' in event) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Process: {event.stepType}
          </p>
          {event.temperature && (
            <p className="text-sm text-muted-foreground">
              Temperature: {event.temperature}°C
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Duration: {event.duration} hours
          </p>
          <p className="text-sm text-muted-foreground">
            Notes: {event.notes}
          </p>
        </div>
      );
    }

    if ('labId' in event) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Test Type: {event.testType}
          </p>
          <p className="text-sm text-muted-foreground">
            Result: {event.results.value} {event.results.unit}
          </p>
          <p className="text-sm text-muted-foreground">
            Standard: {event.results.standard}
          </p>
          <Badge variant={event.results.passed ? "default" : "destructive"} className="text-xs">
            {event.results.passed ? "PASSED" : "FAILED"}
          </Badge>
        </div>
      );
    }

    if ('fromEntity' in event) {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Quantity: {event.quantity} {event.unit}
          </p>
          <p className="text-sm text-muted-foreground">
            Entity Type: {event.entityType}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Provenance Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.map((event, index) => {
            const Icon = getEventIcon(event);
            const colorClass = getEventColor(event);
            
            return (
              <div key={event.id} className="flex gap-4">
                {/* Timeline connector */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {index < sortedEvents.length - 1 && (
                    <div className="w-px h-12 bg-border mt-2" />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground">
                      {getEventTitle(event)}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {new Date(event.timestamp).toLocaleString()}
                    </Badge>
                  </div>
                  {getEventDetails(event)}
                </div>
              </div>
            );
          })}
        </div>

        {sortedEvents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No events recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}