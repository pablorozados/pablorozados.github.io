-- Create table for game advertisements
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  system TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to advertisements" 
ON public.advertisements 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage advertisements
CREATE POLICY "Allow authenticated users to insert advertisements" 
ON public.advertisements 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update advertisements" 
ON public.advertisements 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow authenticated users to delete advertisements" 
ON public.advertisements 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();