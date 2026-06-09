-- PROFILES TABLE

CREATE TABLE core.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT
);

-- RLS for profiles
ALTER TABLE core.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON core.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON core.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Audit trigger for profiles
CREATE TRIGGER audit_profiles_changes
AFTER INSERT OR UPDATE OR DELETE ON core.profiles
FOR EACH ROW EXECUTE FUNCTION audit.log_changes();


-- STORAGE BUCKETS

-- Avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Authenticated users can upload avatars" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Users can view their own avatar" 
ON storage.objects 
FOR SELECT 
USING ( auth.uid() = owner );

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING ( auth.uid() = owner );
