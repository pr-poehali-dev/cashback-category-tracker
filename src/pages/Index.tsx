import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface BankCard {
  id: string;
  name: string;
  color: string;
  bank: string;
}

interface Category {
  id: string;
  name: string;
  cashback: number;
  cardId: string;
  icon: string;
}

const COLORS = ['#8B5CF6', '#D946EF', '#0EA5E9', '#F97316', '#10B981'];

const Index = () => {
  const [cards, setCards] = useState<BankCard[]>([
    { id: '1', name: 'Дебетовая карта', color: '#8B5CF6', bank: 'Сбербанк' },
    { id: '2', name: 'Кредитная карта', color: '#D946EF', bank: 'Тинькофф' },
    { id: '3', name: 'Premium Card', color: '#0EA5E9', bank: 'Альфа-Банк' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Рестораны', cashback: 5, cardId: '1', icon: 'UtensilsCrossed' },
    { id: '2', name: 'Продукты', cashback: 3, cardId: '1', icon: 'ShoppingCart' },
    { id: '3', name: 'Транспорт', cashback: 10, cardId: '2', icon: 'Car' },
    { id: '4', name: 'Развлечения', cashback: 7, cardId: '2', icon: 'Film' },
    { id: '5', name: 'Одежда', cashback: 4, cardId: '3', icon: 'Shirt' },
    { id: '6', name: 'Аптеки', cashback: 2, cardId: '3', icon: 'Heart' },
  ]);

  const [newCard, setNewCard] = useState({ name: '', bank: '', color: '#8B5CF6' });
  const [newCategory, setNewCategory] = useState({ name: '', cashback: 0, cardId: '', icon: 'Star' });
  const [activeTab, setActiveTab] = useState('categories');

  const addCard = () => {
    if (newCard.name && newCard.bank) {
      setCards([...cards, { ...newCard, id: Date.now().toString() }]);
      setNewCard({ name: '', bank: '', color: '#8B5CF6' });
    }
  };

  const addCategory = () => {
    if (newCategory.name && newCategory.cardId) {
      setCategories([...categories, { ...newCategory, id: Date.now().toString() }]);
      setNewCategory({ name: '', cashback: 0, cardId: '', icon: 'Star' });
    }
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    setCategories(categories.filter(cat => cat.cardId !== id));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const chartData = categories.map(cat => ({
    name: cat.name,
    value: cat.cashback,
  }));

  const cardStats = cards.map(card => {
    const cardCategories = categories.filter(cat => cat.cardId === card.id);
    const avgCashback = cardCategories.length > 0
      ? cardCategories.reduce((sum, cat) => sum + cat.cashback, 0) / cardCategories.length
      : 0;
    return {
      name: card.name,
      categories: cardCategories.length,
      avgCashback: avgCashback.toFixed(1),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              CashBack Tracker
            </h1>
            <p className="text-muted-foreground mt-2">Управляйте кэшбэком и картами</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="hover:bg-primary/10">
              <Icon name="Bell" size={20} />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-primary/10">
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Всего карт</CardTitle>
              <Icon name="CreditCard" className="text-primary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{cards.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Активных банковских карт</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Категорий</CardTitle>
              <Icon name="Tags" className="text-secondary" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground mt-1">С настроенным кэшбэком</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Средний %</CardTitle>
              <Icon name="TrendingUp" className="text-accent" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {categories.length > 0
                  ? (categories.reduce((sum, cat) => sum + cat.cashback, 0) / categories.length).toFixed(1)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Кэшбэк по всем категориям</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="categories" className="gap-2">
              <Icon name="Grid3x3" size={16} />
              Категории
            </TabsTrigger>
            <TabsTrigger value="cards" className="gap-2">
              <Icon name="CreditCard" size={16} />
              Карты
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Icon name="Upload" size={16} />
              Загрузка
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Icon name="Settings" size={16} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Категории кэшбэка</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить категорию
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая категория</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Название</Label>
                      <Input
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        placeholder="Например, Рестораны"
                      />
                    </div>
                    <div>
                      <Label>Процент кэшбэка</Label>
                      <Input
                        type="number"
                        value={newCategory.cashback}
                        onChange={(e) => setNewCategory({ ...newCategory, cashback: parseFloat(e.target.value) })}
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <Label>Карта</Label>
                      <Select value={newCategory.cardId} onValueChange={(value) => setNewCategory({ ...newCategory, cardId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите карту" />
                        </SelectTrigger>
                        <SelectContent>
                          {cards.map((card) => (
                            <SelectItem key={card.id} value={card.id}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: card.color }} />
                                {card.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={addCategory} className="w-full">Создать</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const card = cards.find(c => c.id === category.cardId);
                return (
                  <Card key={category.id} className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader className="flex flex-row items-start justify-between pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${card?.color}20` }}>
                          <Icon name={category.icon as any} size={24} style={{ color: card?.color }} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{card?.bank}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)}>
                        <Icon name="Trash2" size={16} className="text-destructive" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-lg font-bold px-4 py-1">
                          {category.cashback}%
                        </Badge>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: card?.color }} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Распределение кэшбэка</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Статистика по картам</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cardStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="categories" fill="#8B5CF6" name="Категорий" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Мои карты</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить карту
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новая карта</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Название карты</Label>
                      <Input
                        value={newCard.name}
                        onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                        placeholder="Моя карта"
                      />
                    </div>
                    <div>
                      <Label>Банк</Label>
                      <Input
                        value={newCard.bank}
                        onChange={(e) => setNewCard({ ...newCard, bank: e.target.value })}
                        placeholder="Сбербанк"
                      />
                    </div>
                    <div>
                      <Label>Цвет</Label>
                      <div className="flex gap-2 mt-2">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            className={`w-10 h-10 rounded-lg border-2 ${newCard.color === color ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setNewCard({ ...newCard, color })}
                          />
                        ))}
                      </div>
                    </div>
                    <Button onClick={addCard} className="w-full">Создать</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card) => {
                const cardCategories = categories.filter(cat => cat.cardId === card.id);
                return (
                  <Card key={card.id} className="overflow-hidden hover:shadow-xl transition-all">
                    <div className="h-32 p-6 flex flex-col justify-between text-white" style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)` }}>
                      <div className="flex justify-between items-start">
                        <Icon name="CreditCard" size={32} />
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => deleteCard(card.id)}>
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">{card.bank}</p>
                        <p className="font-bold text-lg">{card.name}</p>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Категорий</p>
                          <p className="text-2xl font-bold">{cardCategories.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Средний %</p>
                          <p className="text-2xl font-bold">
                            {cardCategories.length > 0
                              ? (cardCategories.reduce((sum, cat) => sum + cat.cashback, 0) / cardCategories.length).toFixed(1)
                              : 0}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Загрузка скриншота</CardTitle>
                <p className="text-sm text-muted-foreground">Распознавание категорий и кэшбэка из приложения банка</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Перетащите скриншот сюда</p>
                  <p className="text-sm text-muted-foreground mb-4">или нажмите для выбора файла</p>
                  <Button>Выбрать файл</Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={20} className="text-primary mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Поддерживаемые форматы:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Скриншоты из приложений банков</li>
                        <li>Форматы: JPG, PNG, HEIC</li>
                        <li>Максимальный размер: 10 МБ</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Синхронизация</p>
                      <p className="text-sm text-muted-foreground">Облачное хранилище данных</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Cloud" size={16} />
                      Настроить
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Уведомления</p>
                      <p className="text-sm text-muted-foreground">Напоминания о кэшбэке</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Bell" size={16} />
                      Настроить
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Экспорт данных</p>
                      <p className="text-sm text-muted-foreground">Сохранить в CSV или JSON</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Download" size={16} />
                      Экспорт
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
