import { useState, useEffect } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { BudgetTracker } from "@/components/BudgetTracker";
import { ExpenseChart } from "@/components/ExpenseChart";
import { ExpenseList } from "@/components/ExpenseList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingUp, PieChart, List, Wallet } from "lucide-react";
import heroImage from "@/assets/hero-expense.jpg";

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const currentMonth = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const monthlyTotal = expenses
    .filter(expense => expense.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent/10">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={heroImage} 
            alt="Financial Dashboard" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Wallet className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Personal Expense Tracker
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take control of your finances with our comprehensive expense tracking system. 
              Monitor spending, set budgets, and visualize your financial patterns.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6 text-center">
                  <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">${monthlyTotal.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                </CardContent>
              </Card>
              <Card className="bg-card/80 backdrop-blur-sm border-border">
                <CardContent className="p-6 text-center">
                  <PieChart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">${totalExpenses.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">All Time Total</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="add-expense" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="add-expense" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Add Expense</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Budget</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add-expense" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <ExpenseForm onAddExpense={handleAddExpense} />
                <div className="space-y-4">
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-border">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        {currentMonth} Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Spending</p>
                          <p className="text-2xl font-bold text-foreground">
                            ${monthlyTotal.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Transactions</p>
                          <p className="text-2xl font-bold text-foreground">
                            {expenses.filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7))).length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {expenses.length > 0 && (
                    <Card className="bg-card border-border">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Expenses</h3>
                        <div className="space-y-3">
                          {expenses.slice(0, 3).map((expense) => (
                            <div key={expense.id} className="flex justify-between items-center p-3 rounded-lg bg-accent/20">
                              <div>
                                <p className="font-medium text-foreground">{expense.category}</p>
                                <p className="text-sm text-muted-foreground">{expense.date}</p>
                              </div>
                              <p className="font-semibold text-foreground">${expense.amount.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="budget">
              <BudgetTracker expenses={expenses} />
            </TabsContent>

            <TabsContent value="analytics">
              <ExpenseChart expenses={expenses} />
            </TabsContent>

            <TabsContent value="history">
              <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;