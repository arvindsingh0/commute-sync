import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function SyncCard() {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-semibold">Arvin</h3>
              <p className="text-sm text-muted-foreground">
                TCS
              </p>
            </div>
          </div>

          <Badge>Open</Badge>
        </div>

        <div className="space-y-2">
          <p>📍 Rajpur Road</p>
          <p>➡️ IT Park</p>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>🕒 8:30 AM</span>
          <span>👥 2 seats left</span>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">
            Request
          </Button>

          <Button
            variant="outline"
            className="flex-1"
          >
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}