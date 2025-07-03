
-- Update profiles table to include all required fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS pgm_role TEXT,
ADD COLUMN IF NOT EXISTS pgm_number TEXT,
ADD COLUMN IF NOT EXISTS participates_flow_up BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS participates_irmandade BOOLEAN DEFAULT false;

-- Insert the admin user profile if it doesn't exist
INSERT INTO public.profiles (id, name, email, is_admin)
SELECT 
  'd9d967df-6b51-4c06-81c5-2fcd65fbe36b'::uuid,
  'Filipe Admin',
  'filipebiten@gmail.com',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'filipebiten@gmail.com'
);

-- Create some sample missions, books, and courses
INSERT INTO public.missions (name, description, points, period) VALUES
('Leitura Diária', 'Ler a Bíblia por 15 minutos', 5, 'Diário'),
('Oração Matinal', 'Fazer oração ao acordar', 3, 'Diário'),
('Jejum Semanal', 'Jejuar uma vez por semana', 10, 'Semanal'),
('Testemunho', 'Compartilhar testemunho com alguém', 15, 'Mensal')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.books (name, description, points) VALUES
('Bíblia Sagrada', 'Leitura completa da Bíblia', 100),
('Propósito', 'Uma Vida com Propósitos - Rick Warren', 25),
('Batalha Espiritual', 'A Batalha de Cada Homem', 20)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (name, description, points, school) VALUES
('Curso de Liderança', 'Formação em liderança cristã', 50, 'IBAD'),
('Teologia Básica', 'Fundamentos da fé cristã', 40, 'Seminário'),
('Evangelismo', 'Técnicas de evangelismo', 30, 'Igreja Local')
ON CONFLICT (id) DO NOTHING;
