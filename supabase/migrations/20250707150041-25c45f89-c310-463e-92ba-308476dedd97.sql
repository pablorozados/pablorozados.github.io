-- Fix security issue: set explicit search_path for the function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    -- Set search path to empty string for security
    SET search_path = '';
    
    -- Update the updated_at column to current timestamp
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;