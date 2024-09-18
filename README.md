## Setup Github OAuth 
1. Go to Github Developer Settings -> OAuth Apps -> New OAuth App
2. Authorization callback URL: ${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback
3. Magic link template
```html
<h2>Magic Link</h2>

<p>Follow this link to login:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">Log In</a></p>
```

## Generate Supabase Types
https://supabase.com/docs/guides/api/rest/generating-types
```bash
npx supabase gen types --lang=typescript --project-id "${SUPABASE_PROJ_ID}" --schema public > src/types/supabase.ts
```

## Setup Supabase functions & triggers
**function name:** create_user_on_signup
```sql
BEGIN
    INSERT INTO public.users (id,name,avatar_url)
    VALUES (
      NEW.id,
      COALESCE(new.raw_user_meta_data ->>'user_name', new.email, 'Anonymous'),
     COALESCE(
            new.raw_user_meta_data ->> 'avatar_url',
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        )
    );

    RETURN NEW;
END;
```
**trigger:**
```sql
create trigger create_user_on_signup after insert on auth.users for each row execute function create_user_on_signup();
```
