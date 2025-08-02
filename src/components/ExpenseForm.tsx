import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, IndianRupee, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Housing & Rent",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Travel",
  "Other"
];

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      date,
      amount: parseFloat(amount),
      category,
      description
    };

    onAddExpense(expense);
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    
    toast({
      title: "Expense Added!",
      description: `₹${parseFloat(amount).toLocaleString('en-IN')} expense recorded successfully.`,
      variant: "default"
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Plus className="h-5 w-5 text-primary" />
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground">Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">Amount *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Input
              id="description"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input border-border"
            />
          </div>
          
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}