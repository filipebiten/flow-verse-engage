
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  dateRead?: string;
  image?: string;
}

interface BookLibraryProps {
  userId: string;
  booksRead: Book[];
  booksReading?: Book[];
  onUpdateBooks?: () => void;
  readOnly?: boolean;
}

const BookLibrary = ({ booksRead, readOnly = false }: BookLibraryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Books Read */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <BookOpen className="w-5 h-5 mr-2" />
            📚 Livros Lidos ({booksRead.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {booksRead.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Nenhum livro lido ainda</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booksRead.map((book) => (
                <div key={book.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-green-50">
                  {book.image && (
                    <img 
                      src={book.image} 
                      alt={book.title} 
                      className="w-16 h-20 object-cover rounded shadow-sm"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">por {book.author}</p>
                    {book.dateRead && (
                      <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                        Lido em {formatDate(book.dateRead)}
                      </Badge>
                    )}
                  </div>
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
