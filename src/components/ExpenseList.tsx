import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Download, Calendar, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const { toast } = useToast();

  const categories = Array.from(new Set(expenses.map(expense => expense.category)));

  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const handleDelete = (id: string, description: string) => {
    onDeleteExpense(id);
    toast({
      title: "Expense Deleted",
      description: `"${description}" has been removed.`,
    });
  };

  const handleExport = () => {
    const csvContent = [
      'Date,Amount,Category,Description',
      ...expenses.map(expense => 
        `${expense.date},${expense.amount},"${expense.category}","${expense.description}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Your expenses have been exported to CSV.",
    });
  };

  const totalAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="text-foreground">Expense History</CardTitle>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
        
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="amount-desc">Amount (Highest)</SelectItem>
              <SelectItem value="amount-asc">Amount (Lowest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Summary */}
        {filteredAndSortedExpenses.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{filteredAndSortedExpenses.length} expense(s)</span>
            <span>Total: ₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {expenses.length === 0 ? (
              <div>
                <IndianRupee className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No expenses recorded yet.</p>
                <p className="text-sm mt-2">Start tracking your spending by adding your first expense!</p>
              </div>
            ) : (
              <p>No expenses match your current filters.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{expense.date}</span>
                    <Badge variant="secondary" className="text-xs">
                      {expense.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-lg text-foreground">
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {expense.description}
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(expense.id, expense.description || expense.category)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}