import {Card, CardContent} from "@/components/ui/card.tsx";
import {BookOpen, GraduationCap, Target, Users} from "lucide-react";
import React from "react";

export const AdminStats = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">{stats.users}</div>
          <p className="text-sm text-gray-600">Usuários</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">{stats.missions}</div>
          <p className="text-sm text-gray-600">Missões</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold">{stats.books}</div>
          <p className="text-sm text-gray-600">Livros</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <GraduationCap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold">{stats.courses}</div>
          <p className="text-sm text-gray-600">Cursos</p>
        </CardContent>
      </Card>
    </div>
);