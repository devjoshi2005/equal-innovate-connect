-- Link users table to auth.users with cascade delete
ALTER TABLE public.users 
ADD CONSTRAINT users_user_id_auth_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Add unique constraints
ALTER TABLE public.users 
ADD CONSTRAINT users_email_unique UNIQUE (email);

ALTER TABLE public.users 
ADD CONSTRAINT users_username_unique UNIQUE (username);

-- Create function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    user_id,
    email,
    username,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policies for users table
CREATE POLICY "Users can view all profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);