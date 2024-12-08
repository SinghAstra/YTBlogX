"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function ConversionOptions() {
  return (
    <Card className="p-6 space-y-6 bg-card/50">
      <h3 className="text-lg font-semibold">Customization Options</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Writing Style</Label>
          <RadioGroup
            defaultValue="technical"
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="technical" id="technical" />
              <Label htmlFor="technical">Technical</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="casual" id="casual" />
              <Label htmlFor="casual">Casual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed" />
              <Label htmlFor="detailed">Detailed</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="code-snippets">Include Code Snippets</Label>
          <Switch id="code-snippets" />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="screenshots">Include Screenshots</Label>
          <Switch id="screenshots" />
        </div>

        <div className="space-y-2">
          <Label>Target Word Count</Label>
          <Select defaultValue="medium">
            <SelectTrigger>
              <SelectValue placeholder="Select word count range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (500-800 words)</SelectItem>
              <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
              <SelectItem value="long">Long (1200-2000 words)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Output Language</Label>
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
      </div>
    </Card>
  );
}
