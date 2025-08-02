import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

interface ExpenseChartProps {
  expenses: Expense[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Process data for pie chart (spending by category)
  const categoryData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
  })).sort((a, b) => b.value - a.value);

  // Process data for bar chart (monthly trends)
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = expense.date.slice(0, 7); // YYYY-MM format
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }),
      amount,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-xl">
          <p className="text-foreground font-semibold mb-1">{label}</p>
          <p className="text-primary font-medium">
            Amount: ₹{payload[0].value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          {payload[0].payload.percentage && (
            <p className="text-muted-foreground text-sm">
              {payload[0].payload.percentage.toFixed(1)}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / totalSpent) * 100).toFixed(1);
      return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-xl">
          <p className="text-foreground font-semibold mb-1">{data.name}</p>
          <p className="text-primary font-medium">Amount: ₹{data.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p className="text-muted-foreground text-sm">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="grid gap-8">
        <Card className="glass-card shadow-lg">
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <PieChartIcon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No expenses recorded yet</h3>
              <p className="text-sm">Add some expenses to see your spending patterns and analytics!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {/* Spending by Category - Pie Chart */}
      <Card className="glass-card hover-lift shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-foreground font-poppins text-xl">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-2 rounded-lg">
              <PieChartIcon className="h-6 w-6 text-white" />
            </div>
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent/10 to-muted/50 border border-border/30">
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <span className="text-foreground font-medium text-sm block">{entry.name}</span>
                  <span className="text-primary font-semibold text-sm">₹{entry.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends - Bar Chart */}
      {barData.length > 1 && (
        <Card className="glass-card hover-lift shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-foreground font-poppins text-xl">
              <div className="bg-gradient-to-br from-secondary to-secondary/80 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Monthly Spending Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    fontWeight={500}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    fontWeight={500}
                    tickFormatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#colorGradient)"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}