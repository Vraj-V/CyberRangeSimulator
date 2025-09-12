import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface CreateSimulationDialogProps {
  trigger?: React.ReactNode;
  isStartFirst?: boolean;
}

export default function CreateSimulationDialog({ trigger, isStartFirst = false }: CreateSimulationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    targets: "",
    parameters: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createSimulationMutation = useMutation({
    mutationFn: (data: any) => api.createSimulation(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Simulation created and started successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/simulations/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/simulations'] });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create simulation",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      targets: "",
      parameters: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.targets) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const simulationData = {
      name: formData.name,
      type: formData.type,
      targets: formData.targets,
      status: "running",
      startedAt: new Date(),
      parameters: formData.parameters ? JSON.parse(formData.parameters) : {}
    };

    createSimulationMutation.mutate(simulationData);
  };

  const defaultTrigger = (
    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
      <Plus className="w-4 h-4 mr-2" />
      {isStartFirst ? "Start Your First Simulation" : "New Simulation"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Simulation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Simulation Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter simulation name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Simulation Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select simulation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phishing">Phishing Attack</SelectItem>
                <SelectItem value="sqli">SQL Injection</SelectItem>
                <SelectItem value="ddos">DDoS Attack</SelectItem>
                <SelectItem value="malware">Malware Simulation</SelectItem>
                <SelectItem value="brute_force">Brute Force Attack</SelectItem>
                <SelectItem value="xss">Cross-Site Scripting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targets">Target Systems *</Label>
            <Input
              id="targets"
              value={formData.targets}
              onChange={(e) => setFormData(prev => ({ ...prev, targets: e.target.value }))}
              placeholder="e.g., web-server-1, database-cluster, email-system"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parameters">Parameters (JSON format)</Label>
            <Textarea
              id="parameters"
              value={formData.parameters}
              onChange={(e) => setFormData(prev => ({ ...prev, parameters: e.target.value }))}
              placeholder='{"intensity": "medium", "duration": 300, "concurrent_users": 100}'
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createSimulationMutation.isPending}
            >
              {createSimulationMutation.isPending ? "Creating..." : "Create & Start"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}