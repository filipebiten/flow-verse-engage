import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  addedAt: string;
}

interface BookLibraryProps {
  userId: string;
  booksRead: Book[];
  booksReading: Book[];
  onUpdateBooks: (booksRead: Book[], booksReading: Book[]) => void;
  readOnly?: boolean;
}

const BookLibrary = ({ userId, booksRead, booksReading, onUpdateBooks, readOnly = false }: BookLibraryProps) => {
  const { toast } = useToast();
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [bookType, setBookType] = useState<'reading' | 'read'>('reading');
  const [bookForm, setBookForm] = useState({ title: '', author: '' });

  const handleAddBook = () => {
    if (!bookForm.title.trim() || !bookForm.author.trim()) {
      toast({
        title: "Erro",
        description: "Preencha título e autor do livro.",
        variant: "destructive",
      });
      return;
    }

    const newBook: Book = {
      id: Date.now().toString(),
      title: bookForm.title.trim(),
      author: bookForm.author.trim(),
      addedAt: new Date().toISOString()
    };

    let newBooksRead = [...booksRead];
    let newBooksReading = [...booksReading];

    if (bookType === 'read') {
      newBooksRead.push(newBook);
      
      // Add points for reading a book
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.id === userId) {
        const newPoints = currentUser.points + 5; // 5 points for reading a book
        const newPhase = calculatePhase(newPoints);
        const oldPhase = currentUser.phase;
        
        const updatedUser = { ...currentUser, points: newPoints, phase: newPhase };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update user in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === userId);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(users));
        }

        // Add to mission activities
        const activities = JSON.parse(localStorage.getItem('missionActivities') || '[]');
        const newActivity = {
          id: Date.now().toString(),
          userId: currentUser.id,
          userName: currentUser.name,
          userPhoto: currentUser.profilePhoto,
          missionName: 'Leitura de Livro',
          points: 5,
          timestamp: new Date().toISOString()
        };
        activities.unshift(newActivity);
        localStorage.setItem('missionActivities', JSON.stringify(activities));

        toast({
          title: "🎉 Livro adicionado!",
          description: `"${newBook.title}" foi adicionado e você ganhou 5 pontos!`,
        });

        // Check for phase change
        if (oldPhase !== newPhase) {
          setTimeout(() => {
            const phaseInfo = getPhaseInfo(newPhase);
            toast({
              title: `🌟 Nova Fase Desbloqueada!`,
              description: `${phaseInfo.emoji} ${newPhase}: ${phaseInfo.phrase}`,
              className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            });
          }, 1000);
        }
      }
    } else {
      newBooksReading.push(newBook);
      toast({
        title: "Livro adicionado!",
        description: `"${newBook.title}" foi adicionado à sua lista de leitura.`,
      });
    }

    onUpdateBooks(newBooksRead, newBooksReading);

    setBookForm({ title: '', author: '' });
    setIsAddingBook(false);
  };

  const calculatePhase = (points: number): string => {
    if (points >= 1001) return "Oceano";
    if (points >= 501) return "Cachoeira";
    if (points >= 251) return "Correnteza";
    return "Riacho";
  };

  const getPhaseInfo = (phase: string) => {
    const phases = {
      "Riacho": { emoji: "🌀", phrase: "Começando a fluir" },
      "Correnteza": { emoji: "🌊", phrase: "Sendo levado por algo maior" },
      "Cachoeira": { emoji: "💥", phrase: "Entregue ao movimento de Deus" },
      "Oceano": { emoji: "🌌", phrase: "Profundamente imerso em Deus" }
    };
    return phases[phase as keyof typeof phases] || phases["Riacho"];
  };

  const handleRemoveBook = (bookId: string, type: 'reading' | 'read') => {
    let newBooksRead = [...booksRead];
    let newBooksReading = [...booksReading];

    if (type === 'read') {
      newBooksRead = booksRead.filter(book => book.id !== bookId);
    } else {
      newBooksReading = booksReading.filter(book => book.id !== bookId);
    }

    onUpdateBooks(newBooksRead, newBooksReading);

    toast({
      title: "Livro removido",
      description: "O livro foi removido da sua biblioteca.",
    });
  };

  const handleMoveToRead = (bookId: string) => {
    const book = booksReading.find(b => b.id === bookId);
    if (!book) return;

    const newBooksReading = booksReading.filter(b => b.id !== bookId);
    const newBooksRead = [...booksRead, { ...book, addedAt: new Date().toISOString() }];

    onUpdateBooks(newBooksRead, newBooksReading);

    toast({
      title: "Parabéns! 🎉",
      description: `Você terminou de ler "${book.title}"!`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Currently Reading */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Lendo Atualmente ({booksReading.length})
            </CardTitle>
            {!readOnly && (
              <Dialog open={isAddingBook && bookType === 'reading'} onOpenChange={(open) => {
                setIsAddingBook(open);
                setBookType('reading');
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Livro que Estou Lendo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título do Livro</Label>
                      <Input
                        id="title"
                        value={bookForm.title}
                        onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Digite o título do livro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author">Autor</Label>
                      <Input
                        id="author"
                        value={bookForm.author}
                        onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Digite o nome do autor"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddBook} className="flex-1">
                        Adicionar
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingBook(false)} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {booksReading.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum livro sendo lido no momento</p>
          ) : (
            <div className="space-y-3">
              {booksReading.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{book.title}</h4>
                    <p className="text-sm text-gray-600">por {book.author}</p>
                  </div>
                  {!readOnly && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleMoveToRead(book.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Terminei!
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveBook(book.id, 'reading')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Books Read */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Livros Lidos ({booksRead.length})
            </CardTitle>
            {!readOnly && (
              <Dialog open={isAddingBook && bookType === 'read'} onOpenChange={(open) => {
                setIsAddingBook(open);
                setBookType('read');
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Livro Lido</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title-read">Título do Livro</Label>
                      <Input
                        id="title-read"
                        value={bookForm.title}
                        onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Digite o título do livro"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="author-read">Autor</Label>
                      <Input
                        id="author-read"
                        value={bookForm.author}
                        onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Digite o nome do autor"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleAddBook} className="flex-1">
                        Adicionar
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingBook(false)} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {booksRead.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum livro lido ainda</p>
          ) : (
            <div className="space-y-2">
              {booksRead.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium text-gray-800">{book.title}</span>
                    <span className="text-sm text-gray-600 ml-2">por {book.author}</span>
                  </div>
                  {!readOnly && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveBook(book.id, 'read')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookLibrary;
