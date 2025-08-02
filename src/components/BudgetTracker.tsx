import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Settings, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Budget {
  category: string;
  limit: number;
  spent: number;
}

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface BudgetTrackerProps {
  expenses: Expense[];
}

const defaultCategories = [
  "Food & Dining",
  "Transportation", 
  "Housing & Rent",
  "Utilities",
  "Shopping",
  "Entertainment"
];

export function BudgetTracker({ expenses }: BudgetTrackerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize budgets for default categories
    const initialBudgets = defaultCategories.map(category => ({
      category,
      limit: 500,
      spent: 0
    }));
    setBudgets(initialBudgets);
  }, []);

  useEffect(() => {
    // Update spent amounts based on expenses
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = expenses.filter(expense => 
      expense.date.startsWith(currentMonth)
    );

    setBudgets(prevBudgets => 
      prevBudgets.map(budget => {
        const categoryExpenses = monthlyExpenses.filter(
          expense => expense.category === budget.category
        );
        const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        return { ...budget, spent };
      })
    );
  }, [expenses]);

  const handleEditBudget = (category: string, currentLimit: number) => {
    setEditingBudget(category);
    setTempLimit(currentLimit.toString());
  };

  const handleSaveBudget = (category: string) => {
    const newLimit = parseFloat(tempLimit);
    if (isNaN(newLimit) || newLimit <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid budget amount.",
        variant: "destructive"
      });
      return;
    }

    setBudgets(prevBudgets =>
      prevBudgets.map(budget =>
        budget.category === category
          ? { ...budget, limit: newLimit }
          : budget
      )
    );
    
    setEditingBudget(null);
    setTempLimit('');
    
    toast({
      title: "Budget Updated",
      description: `${category} budget set to $${newLimit.toFixed(2)}`,
    });
  };

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.limit) * 100;
    if (percentage >= 100) return { color: "bg-destructive", status: "Over Budget", icon: AlertTriangle };
    if (percentage >= 80) return { color: "bg-warning", status: "Near Limit", icon: TrendingUp };
    return { color: "bg-primary", status: "On Track", icon: PiggyBank };
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overall Budget Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <PiggyBank className="h-5 w-5 text-primary" />
            Monthly Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">${totalBudget.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold ${totalSpent > totalBudget ? 'text-destructive' : 'text-success'}`}>
                ${(totalBudget - totalSpent).toFixed(2)}
              </p>
            </div>
          </div>
          <Progress value={overallPercentage} className="h-3" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            {overallPercentage.toFixed(1)}% of total budget used
          </p>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Budget by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {budgets.map((budget) => {
              const { color, status, icon: StatusIcon } = getBudgetStatus(budget);
              const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
              
              return (
                <div key={budget.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{budget.category}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        status === 'Over Budget' ? 'bg-destructive/10 text-destructive' :
                        status === 'Near Limit' ? 'bg-warning/10 text-warning' :
                        'bg-success/10 text-success'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingBudget === budget.category ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={tempLimit}
                            onChange={(e) => setTempLimit(e.target.value)}
                            className="w-24 h-8 text-sm"
                            placeholder="0.00"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveBudget(budget.category)}
                            className="h-8 px-3"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBudget(null)}
                            className="h-8 px-3"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-muted-foreground">
                            ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditBudget(budget.category, budget.limit)}
                            className="h-8 w-8 p-0"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>${(budget.limit - budget.spent).toFixed(2)} remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}