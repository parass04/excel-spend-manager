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
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Financial Dashboard" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/80"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-gradient-to-br from-primary to-secondary rounded-full glow-effect hover-lift">
                <Wallet className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6">
              <span className="gradient-text">Personal Expense</span>
              <br />
              <span className="text-foreground">Tracker</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-inter leading-relaxed">
              Take control of your finances with our comprehensive expense tracking system. 
              Monitor spending, set budgets, and visualize your financial patterns in Indian Rupees.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="glass-card hover-lift glow-effect">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-primary to-primary/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold font-poppins text-foreground mb-2">₹{monthlyTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  <p className="text-sm text-muted-foreground font-medium">This Month</p>
                </CardContent>
              </Card>
              <Card className="glass-card hover-lift glow-effect">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-secondary to-secondary/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold font-poppins text-foreground mb-2">{expenses.length}</p>
                  <p className="text-sm text-muted-foreground font-medium">Total Transactions</p>
                </CardContent>
              </Card>
              <Card className="glass-card hover-lift glow-effect">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-financial-blue to-financial-blue/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PieChart className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold font-poppins text-foreground mb-2">₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                  <p className="text-sm text-muted-foreground font-medium">All Time Total</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="add-expense" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-card to-muted border border-border/50 shadow-lg">
              <TabsTrigger value="add-expense" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Add Expense</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all duration-300">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Budget</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-financial-blue data-[state=active]:text-white transition-all duration-300">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-300">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add-expense" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <ExpenseForm onAddExpense={handleAddExpense} />
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-border shadow-lg hover-lift">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold font-poppins text-foreground mb-6">
                        {currentMonth} Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-primary to-primary/80 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calculator className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-muted-foreground font-medium mb-1">Monthly Spending</p>
                          <p className="text-2xl font-bold font-poppins text-foreground">
                            ₹{monthlyTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-secondary to-secondary/80 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <TrendingUp className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm text-muted-foreground font-medium mb-1">Transactions</p>
                          <p className="text-2xl font-bold font-poppins text-foreground">
                            {expenses.filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7))).length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {expenses.length > 0 && (
                    <Card className="glass-card hover-lift shadow-lg">
                      <CardContent className="p-8">
                        <h3 className="text-xl font-bold font-poppins text-foreground mb-6">Recent Expenses</h3>
                        <div className="space-y-4">
                          {expenses.slice(0, 3).map((expense) => (
                            <div key={expense.id} className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-accent/10 to-muted/50 border border-border/30 hover:shadow-md transition-all duration-200">
                              <div>
                                <p className="font-semibold text-foreground font-inter">{expense.category}</p>
                                <p className="text-sm text-muted-foreground">{new Date(expense.date).toLocaleDateString('en-IN')}</p>
                              </div>
                              <p className="font-bold text-lg text-primary">₹{expense.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
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