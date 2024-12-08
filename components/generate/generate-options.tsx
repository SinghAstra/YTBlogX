"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function GenerateOptions() {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-format">Auto Format</Label>
          <Switch id="auto-format" defaultChecked />
        </div>

        <div className="space-y-2">
          <Label>Language</Label>
          <Select defaultValue="en">
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Content Length</Label>
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
          <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="keep-timestamps">Keep Timestamps</Label>
          <Switch id="keep-timestamps" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="include-summary">Include Summary</Label>
          <Switch id="include-summary" defaultChecked />
        </div>
      </TabsContent>
    </Tabs>
  );
}
